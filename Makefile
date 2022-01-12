# For bitbucket-pipeline.yml
define run-tests
	docker save -o tmp-$(1)-$(2)-image.docker ${DOCKER_REGISTRY}/nanos/$(2):$(1)
endef

define build_common
	docker build -t ${DOCKER_REGISTRY}/nanos/$(2):$(1) -f $(3) --build-arg TARGET_DIR=/app --build-arg SSH_PRIVATE_KEY="" --build-arg GOBIN=/.bin .
	docker tag ${DOCKER_REGISTRY}/nanos/$(2):$(1) $(2)_local_go:latest
	docker save -o tmp-$(1)-$(2)-image.docker ${DOCKER_REGISTRY}/nanos/$(2):$(1)
endef


define push_common
	docker load -i tmp-$(1)-$(2)-image.docker
	docker tag ${DOCKER_REGISTRY}/nanos/$(2):$(1) ${DOCKER_REGISTRY}/nanos/$(2):$(1)-${BITBUCKET_COMMIT}
	docker push ${DOCKER_REGISTRY}/nanos/$(2):$(1)
	docker push ${DOCKER_REGISTRY}/nanos/$(2):$(1)-${BITBUCKET_COMMIT}
endef

define deploy_common
    $(foreach i,$(services),aws ecs update-service --cluster nanos-$(1) --service nanos-$(i)-$(1) --force-new-deployment;)
endef

services = bc-watcher

test-app:
	$(call run-tests,${ENV_NAME},${ECR_NAME})

build-app:
	$(call build_common,${ENV_NAME},${ECR_NAME},${DOCKERFILE_NAME})

push-app:
	$(call push_common,${ENV_NAME},${ECR_NAME})

deploy-app:
	$(call deploy_common,${ENV_NAME})

slack-notification:
	curl -s -X POST ${SLACK_NOTIFICATION_URL} \
	-H "content-type:application/json" \
	-d '{"text":"[${BITBUCKET_REPO_SLUG}] [${BITBUCKET_BRANCH}] ${MESSAGE}"}'

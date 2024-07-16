module "service" {
  source = "git@github.com:trade-tariff/trade-tariff-platform-terraform-modules.git//aws/ecs-service?ref=aws/ecs-service-v1.12.0"

  region = var.region

  service_name  = local.service
  service_count = var.service_count

  private_dns_namespace = "tariff.internal"

  cluster_name              = "trade-tariff-cluster-${var.environment}"
  subnet_ids                = data.aws_subnets.private.ids
  security_groups           = [data.aws_security_group.this.id]
  target_group_arn          = data.aws_lb_target_group.this.arn
  cloudwatch_log_group_name = "platform-logs-${var.environment}"

  min_capacity = var.min_capacity
  max_capacity = var.max_capacity

  docker_image = data.aws_ssm_parameter.ecr_url.value
  docker_tag   = var.docker_tag
  skip_destroy = true

  container_port = 8080

  cpu    = var.cpu
  memory = var.memory

  task_role_policy_arns = [
    aws_iam_policy.task.arn
  ]

  execution_role_policy_arns = [
    aws_iam_policy.exec.arn
  ]

  enable_ecs_exec = true

  service_environment_config = [
    {
      name  = "PORT"
      value = "8080"
    },
    {
      name  = "GOVUK_APP_DOMAIN"
      value = "tea.${var.base_domain}"
    },
    {
      name  = "SENTRY_ENVIRONMENT"
      value = var.environment
    },
  ]

  service_secrets_config = [
    {
      name       = "DB_SECRET"
      value_from = local.db_secret_password
    }
  ]
}

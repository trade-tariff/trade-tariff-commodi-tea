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

  init_container         = true
  init_container_command = local.init_command

  task_role_policy_arns = [
    aws_iam_policy.task.arn
  ]

  execution_role_policy_arns = [
    aws_iam_policy.exec.arn
  ]

  enable_ecs_exec = true

  service_environment_config = [
    {
      name  = "COGNITO_OPEN_ID_BASE_URL"
      value = "http://tea.${var.base_domain}"
    },
    {
      name  = "COGNITO_OPEN_ID_CALLBACK_PATH"
      value = "/auth/redirect"
    },
    {
      name  = "COGNITO_OPEN_ID_CUSTOM_DOMAIN"
      value = local.cognito_custom_domain
    },
    {
      name  = "COGNITO_OPEN_ID_ISSUER_BASE_URL"
      value = local.cognito_pool_url
    },
    {
      name  = "GOVUK_APP_DOMAIN"
      value = "tea.${var.base_domain}"
    },
    {
      name  = "LOG_LEVEL"
      value = var.log_level
    },
    {
      name  = "PORT"
      value = "8080"
    },
    {
      name  = "SENTRY_ENVIRONMENT"
      value = var.environment
    },
  ]

  service_secrets_config = [
    {
      name      = "DATABASE_URL"
      valueFrom = data.aws_secretsmanager_secret.database_connection_string.arn
    },
    {
      name      = "COOKIE_SIGNING_SECRET"
      valueFrom = data.aws_secretsmanager_secret.cookie_signing_secret.arn
    },
    {
      name      = "COGNITO_OPEN_ID_CLIENT_ID"
      valueFrom = data.aws_secretsmanager_secret_version.cognito_open_id_client_id_version.secret_string
    },
    {
      name      = "COGNITO_OPEN_ID_CLIENT_SECRET"
      valueFrom = data.aws_secretsmanager_secret_version.cognito_open_id_client_secret_version.secret_string
    },
    {
      name      = "COGNITO_OPEN_ID_SECRET"
      valueFrom = data.aws_secretsmanager_secret_version.cognito_open_id_secret_version.secret_string
    },
  ]
}

module "service" {
  source = "git@github.com:trade-tariff/trade-tariff-platform-terraform-modules.git//aws/ecs-service?ref=aws/ecs-service-v1.16.0"

  region                    = "eu-west-2"
  container_definition_kind = "db-backed"
  init_container_command    = ["/bin/sh", "-c", "npx sequelize-cli db:migrate"]

  service_name  = "tea"
  service_count = var.service_count

  private_dns_namespace = "tariff.internal"

  cluster_name              = "trade-tariff-cluster-${var.environment}"
  subnet_ids                = data.aws_subnets.private.ids
  security_groups           = [data.aws_security_group.this.id]
  target_group_arn          = data.aws_lb_target_group.this.arn
  cloudwatch_log_group_name = "platform-logs-${var.environment}"

  min_capacity = var.min_capacity
  max_capacity = var.max_capacity

  docker_image = "382373577178.dkr.ecr.eu-west-2.amazonaws.com/tariff-tea-production"
  docker_tag   = var.docker_tag
  skip_destroy = true

  container_port = 8080

  cpu    = var.cpu
  memory = var.memory

  task_role_policy_arns = [aws_iam_policy.task.arn]

  enable_ecs_exec = true

  service_environment_config = local.secret_env_vars
}

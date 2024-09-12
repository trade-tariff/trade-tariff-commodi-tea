locals {
  cognito_custom_domain = "https://auth.tea.${var.base_domain}"
  cognito_user_pool_id  = split("/", data.aws_cognito_user_pools.this.arns[0])[1]
  cognito_pool_url      = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${local.cognito_user_pool_id}"
  init_command          = ["/bin/sh", "-c", "npx sequelize-cli db:migrate"]
  service               = "tea"
}

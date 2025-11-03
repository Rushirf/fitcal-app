resource "aws_elastic_beanstalk_application" "fitcal-app" {
  name = var.beanstalk.application.name
}


resource "aws_elastic_beanstalk_environment" "fitcal-env" {
  application = aws_elastic_beanstalk_application.fitcal-app.name
  name = var.beanstalk.environment.name
  tier = var.beanstalk.environment.tier
  solution_stack_name = var.beanstalk.environment.solution_stack_name
  depends_on = [ aws_db_instance.fitcal-rds,aws_iam_instance_profile.fitcal_beanstalk_ec2_instance_profile,aws_iam_role.beanstalk-service-role ]

  dynamic "setting" {
    for_each = local.all_settings
    content {
      namespace = setting.value.namespace
      name      = setting.value.name
      value     = setting.value.value
    }
  }

}


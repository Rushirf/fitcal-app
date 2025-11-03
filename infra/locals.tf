locals {
  dynamic_beanstalk_settings = [
      {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "IamInstanceProfile"
        value     = aws_iam_instance_profile.fitcal_beanstalk_ec2_instance_profile.name
      },
      {
        namespace = "aws:ec2:vpc"
        name      = "VPCId"
        value     = aws_vpc.fitcalapp-vpc.id
      },
      {
        namespace = "aws:ec2:vpc"
        name      = "Subnets"
        value     = join(",", [for s in values(aws_subnet.fitcalapp-private-subnet) : s.id])
      },
      {
        namespace = "aws:ec2:vpc"
        name      = "ELBSubnets"
        value     = join(",", [for s in values(aws_subnet.fitcalapp-public-subnet) : s.id])
      },
      {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "SecurityGroups"
        value     = join(",",[aws_security_group.fitcalapp-security-groups["rds-sg"].id])
      },
      {
        namespace = "aws:elasticbeanstalk:environment"
        name      = "ServiceRole"
        value     = aws_iam_role.beanstalk-service-role.name
      },
      {
        namespace = "aws:elbv2:loadbalancer"
        name      = "SecurityGroups"
        value     = join(",",[aws_security_group.fitcalapp-security-groups["alb-sg"].id])
      },
      {
        namespace = "aws:elasticbeanstalk:application:environment"
        name      = "DB_NAME"
        value     = var.rds.instance.db_name
      },
      {
        namespace = "aws:elasticbeanstalk:application:environment"
        name      = "DB_HOST"
        value     = aws_db_instance.fitcal-rds.address
      },
      {
        namespace = "aws:elasticbeanstalk:application:environment"
        name      = "DB_USER"
        value     = var.rds.instance.username
      },
      {
        namespace = "aws:elasticbeanstalk:application:environment"
        name      = "DB_SECRET_ARN"
        value     = aws_db_instance.fitcal-rds.master_user_secret[0].secret_arn
      }
  ]

  all_settings = concat(local.dynamic_beanstalk_settings, var.beanstalk.environment.settings)

}


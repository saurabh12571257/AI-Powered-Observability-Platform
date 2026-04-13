variable "instance_type" {
  type        = string
  description = "EC2 instance type for the web server"
  default     = "t3.medium"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where EKS will be deployed"
}

variable "subnets" {
  type        = list(string)
  description = "List of subnet IDs for EKS"
}
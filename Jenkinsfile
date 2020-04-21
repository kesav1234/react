properties([
	parameters([
		choice(choices: "uat\nprod", description: 'KIRKE environment', name: 'environment')
	])
])

def environment = params.environment

if (environment == 'prod') {
	K8sDockerPipelineBuild {
        credentials_id    = 'svc-ucmprd'
        lob               = 'nts'
        vsad              = 'msjv'
        app_name          = 'kirkeucmsso'
        group_id          = 'com.verizon.ucm'
        docker_file       = 'Dockerfile'
        docker_build_args = [
            ENV: "${environment}"
        ]
    }

} else if (environment == 'uat') {
    K8sDockerPipeline {
        credentials_id    = 'svc-ucmprd'
        lob               = 'nts'
        vsad              = 'msjv'
        app_name          = 'kirkeucmsso-uat'
        app_version       = '1.0.0'
        group_id          = 'com.verizon.ucm'
        docker_file       = 'Dockerfile'
        cluster_name      = 'c1-k8s-go0v'
        cluster_zone      = 'green'
        cluster_region    = 'us-east-1'
        cluster_env       = 'np'
        deploy_env        = 'ucmuat'
        k8s_namespace     = 'msjv-uat-ucm'
        helm_values_file  = 'values.yaml'
        docker_build_args = [
            ENV: "${environment}"
        ]
    }
}
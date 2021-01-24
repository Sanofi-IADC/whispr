read -t 5 -p "Waiting for a few seconds for docker to be ready before spinning everything up..."
echo
echo
echo "Starting up dev environment dockers (mongo, redis, localstack)..."
echo
docker-compose -f docker-compose.dev.yml up -d
echo
echo "Spin-up of supporting dockers (mongo, redis, localstack) complete (assuming you saw no errors above)."
echo "If you did see some docker errors above please check the docker terminal window and refer to this article: https://www.gitpod.io/blog/root-docker-and-vscode/."
echo
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]
then
    echo "AWS access keys do not appear to be configured. Setting dummy value for both so you can run tests. You can overwrite this by exporting a new value or setting it in your GitPod env vars."
    export AWS_ACCESS_KEY_ID=dummy && export AWS_SECRET_ACCESS_KEY=dummy
fi
echo "Dev environment setup complete. You should be ready to code! npm run start to launch, or npm run test to run tests."
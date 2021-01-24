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
    export AWS_ACCESS_KEY_ID=dummy
    export AWS_SECRET_ACCESS_KEY=dummy
fi
echo
echo "Setting node version just in case..."
nvm install 12.13.0
echo
echo -n "Waiting for init script to complete before spinning things up. This might take a few minutes due to npm package installation. Check the init terminal window for progress..."
sleep 1 && while [ -f /tmp/.npm-lock ]; do echo -n "." && sleep 1; done
echo "Init script done :)"
echo
echo "Dev environment setup complete. You should be ready to code!"
echo "  > npm run start to launch"
echo "  > npm run test to run tests"
echo
echo -n "Ready. " && sleep 0.75  && echo -n "Steady. " && sleep 0.75 && echo -n "Code!" && sleep 0.25 && echo ""
echo " "
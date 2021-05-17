echo -n "Waiting for a few seconds to ensure that docker has started before spinning everything up..." && sleep 1 && echo -n . && sleep 1 && echo -n . && sleep 1 && echo -n .
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
echo "Installing K6 for load testing..."
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
echo
echo -n "Waiting for init script to complete. This might take a few minutes due to npm package installation. Check the init terminal window for progress..."
sleep 1 && while [ -f /tmp/.npm-lock ]; do echo -n "." && sleep 1; done
echo "Init script done :)"
echo
echo "Dev environment setup complete. You should be ready to code, but you might need to setup your local.env before you can run whispr. Copy test.env or example.env into local.env for a quick start."
echo "Please be aware that commits can take a few seconds to complete as we use Husky pre-commit hooks to lint, format and check the commit message complies to our standards."
echo "  > npm run start to launch"
echo "  > npm run test to run tests"
echo
echo -n "Ready. " && sleep 0.75  && echo -n "Steady. " && sleep 0.75 && echo -n "Code!" && sleep 0.25 && echo ""
echo " "
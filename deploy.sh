ssh root@5.161.89.181 <<EOF
  cd TradeUp;
  git pull origin main;
  docker compose up -d --build;
EOF

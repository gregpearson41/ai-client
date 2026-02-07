# AI-Client Tool


## Installation
# ─────────────────────────────────────────────────────────────
# AI Client – launch backend, admin dashboard, and client
#
# Configuration
#   Default ports live in ./ports.env  –  edit that file to
#   change them permanently.  CLI flags override ports.env.
#
# Usage
#   ./start.sh
#   ./start.sh --backend 6000 --dashboard 6001 --client 6002
#   ./start.sh --help
# ─────────────────────────────────────────────────────────────


## Usage

## Contributing

## License
@TechLifeCorp.com
Technology Life Corporation

# 1. Copy the entire ai-client directory over, then:

# 2. Edit admin-backend/.env for production:
#      NODE_ENV=production
#      PORT=         (whatever port you want)
#      MONGODB_URI=  (production MongoDB)
#      JWT_SECRET=   (generate a new one)

# 3. Start the single process:
cd admin-backend
NODE_ENV=production npm install --production
NODE_ENV=production npm start

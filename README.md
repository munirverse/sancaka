# Sancaka

A Modern Monitoring Uptime Dashboard

![Sancaka Dashboard Cover](https://raw.githubusercontent.com/munirverse/sancaka/refs/heads/main/public/screenshot.png)

## Features

- Real-time uptime monitoring
- Alerts and notifications for downtime
- Historical data and analytics
- Modern & User-friendly interface

## Getting Started

To run the Sancaka Dashboard using Docker, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/munirverse/sancaka-dashboard.git
   cd sancaka-dashboard
2. **Copy and Setup .env files**:
    ```bash
    cp .env-example .env
    ```
    > **Notes**: edit the value of env keys

3. **Build and run the Docker container**:
    ```bash
    docker-compose build && docker-compose up -d 
    ```
4. Open your browser and navigate to http://localhost:3000 to view the dashboard.


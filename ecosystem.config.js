module.exports = {
    apps: [
      {
        name: "THAIMED-KPI",
        script: "./node_modules/next/dist/bin/next",
        args: "start",
        env: {
          PORT: 4444,
          NODE_ENV: "production",
        },
      },
    ],
  };
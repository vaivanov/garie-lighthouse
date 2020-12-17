import { InfluxDB } from 'influx'

const connection = process.env.INFLUXDB_URL ? process.env.INFLUXDB_URL : {
  host: process.env.INFLUXDB_HOST || 'localhost',
  port: process.env.INFLUXDB_PORT || 8086,
  username: process.env.INFLUXDB_USERNAME || 'admin',
  username: process.env.INFLUXDB_PASSWORD || 'admin',
  database: process.env.INFLUXDB_DATABASE || 'lighthouse',
  protocol: process.env.INFLUXDB_PROTOCOL || 'http',
}

export default new InfluxDB(connection)

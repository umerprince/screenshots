/* Note: do not use ES6 features here, we need to use this module from the build system before translation */
const convict = require("convict");
const envc = require("envc");

// Populate `process.env` with overrides from environment-specific `.env`
// files as a side effect. See `https://npmjs.org/envc` for more info.
envc({booleans: true});

var conf = convict({
  port: {
    doc: "The Screenshots server port",
    format: "port",
    default: 10080,
    env: "PORT",
    arg: "port"
  },
  siteOrigin: {
    doc: "The server public origin (except protocol)",
    format: String,
    default: "localhost:10080",
    env: "SITE_ORIGIN",
    arg: "siteOrigin"
  },
  contentOrigin: {
    doc: "The content server public origin (except protocol)",
    format: String,
    default: "localhost:10080",
    env: "CONTENT_ORIGIN",
    arg: "contentOrigin"
  },
  expectProtocol: {
    doc: "Treat all incoming requests as using this protocol, instead of defaulting to http: or detecting from X-Forwarded-Proto",
    format: String,
    default: "",
    env: "EXPECT_PROTOCOL",
    arg: "expectProtocol"
  },
  localhostSsl: {
    doc: "Turn on SSL on localhost, using ~/.localhost-ssl/*",
    format: Boolean,
    default: false,
    env: "LOCALHOST_SSL",
    arg: "localhost-ssl"
  },
  useS3: {
    doc: "If true, store files in s3. If false, store them locally",
    format: Boolean,
    default: false,
    env: "USE_S3",
    arg: "useS3"
  },
  s3BucketName: {
    doc: "The name of the bucket to use on s3, if useS3 is true",
    format: String,
    default: "pageshot-images-bucket",
    env: "S3_BUCKET_NAME",
    arg: "s3BucketName"
  },
  oAuth: {
    oAuthServer: {
      doc: "The FxA OAuth server base URL",
      format: String,
      default: "https://oauth-stable.dev.lcip.org/v1",
      env: "OAUTH_SERVER",
      arg: "oauth-server",
    },
    contentServer: {
      doc: "The FxA content server base URL",
      format: String,
      default: "https://stable.dev.lcip.org",
      env: "CONTENT_SERVER",
      arg: "content-server",
    },
    profileServer: {
      doc: "The FxA profile server base URL",
      format: String,
      default: "https://stable.dev.lcip.org/profile/v1",
      env: "PROFILE_SERVER",
      arg: "profile-server",
    },
    clientId: {
      doc: "The OAuth client ID",
      format: String,
      default: "",
      env: "CLIENT_ID",
      arg: "client-id"
    },
    clientSecret: {
      doc: "The OAuth client secret",
      format: String,
      default: "",
      env: "CLIENT_SECRET",
      arg: "client-secret"
    }
  },
  db: {
    user: {
      doc: "The Postgres user",
      format: String,
      default: process.env.USER,
      env: "RDS_USERNAME",
      arg: "db-user"
    },
    password: {
      doc: "The Postgres password",
      format: String,
      default: "",
      env: "RDS_PASSWORD",
      arg: "db-pass"
    },
    host: {
      doc: "The Postgres server host and port",
      format: String,
      default: "localhost:5432",
      env: "RDS_HOSTNAME",
      arg: "db-host"
    },
    dbname: {
      doc: "The Postgres database",
      format: String,
      default: "",
      env: "RDS_NAME",
      arg: "db-name"
    },
    forceDbVersion: {
      doc: "Force database version (for use in downgrades)",
      format: "int",
      default: 0,
      env: "FORCE_DB_VERSION",
      arg: "force-db-version"
    }
  },
  gaId: {
    doc: "Give the Google Analytics code",
    format: String,
    default: "",
    env: "GA_ID",
    arg: "ga-id"
  },
  // This is mostly configurable for debugging purposes:
  checkDeletedInterval: {
    doc: "Frequency in seconds to check for items that should be purged",
    format: "int",
    default: 60 * 60, // 1 hour
    env: "CHECK_DELETED_INTERVAL",
    arg: "check-deleted-interval"
  },
  expiredRetentionTime: {
    doc: "Amount of time to keep an expired shot, in seconds",
    format: "int",
    default: 60 * 60 * 24 * 14, // 14 days
    env: "EXPIRED_RETENTION_TIME",
    arg: "expired-retention-time"
  },
  defaultExpiration: {
    doc: "Default expiration time, in seconds",
    format: "int",
    default: 60 * 60 * 24 * 14, // 14 days
    env: "DEFAULT_EXPIRATION",
    arg: "default-expiration"
  },
  refreshMetricsTime: {
    doc: "Interval when the stats in /metrics are recalculated, in seconds (0 to disable)",
    format: "int",
    default: 60 * 60, // 1 hour
    env: "REFRESH_METRICS_TIME",
    arg: "refresh-metrics-time"
  },
  disableMetrics: {
    doc: "If true, do not mount /metrics or start jobs",
    format: Boolean,
    default: false,
    env: "DISABLE_METRICS",
    arg: "disable-metrics"
  },
  sentryDSN: {
    doc: "The sentry DSN URL to use for recording errors, if any. Sentry is not used on the server unless this parameter is provided.",
    format: String,
    default: "",
    env: "SENTRY_DSN",
    arg: "sentry-dsn"
  },
  sentryPublicDSN: {
    doc: "The public sentry DSN URL to use for recording errors from the site and from the addon. Sentry is not used on the client if this parameter is not provided.",
    format: String,
    default: "",
    env: "SENTRY_PUBLIC_DSN",
    arg: "sentry-public-dsn"
  },
  upgradeSearchBatchSize: {
    doc: "Number of search records to try to upgrade at one time (in minutes)",
    format: "int",
    default: 100,
    env: "UPGRADE_SEARCH_BATCH_SIZE",
    arg: "upgrade-search-batch-size"
  },
  log: {
    lint: {
      doc: "Whether to lint usage of log messages",
      format: Boolean,
      default: false,
      env: "LOG_LINT",
      arg: "log-lint"
    },
    level: {
      doc: "Log level to emit",
      format: String,
      default: "info",
      env: "LOG_LEVEL",
      arg: "log-level"
    }
  },
  showStackTraces: {
    doc: "Whether to show stack traces in 500 HTTP responses",
    format: Boolean,
    default: false,
    env: "SHOW_STACK_TRACES",
    arg: "show-stack-traces"
  },
  debugGoogleAnalytics: {
    doc: "Include debug information about events send to Google Analytics",
    format: Boolean,
    default: false,
    env: "DEBUG_GOOGLE_ANALYTICS",
    arg: "debug-google-analytics"
  },
  testing: {
    failSometimes: {
      doc: "Fail on PUT /data/... requests sometimes (succeed 1 every N times)",
      format: "int",
      default: 0,
      env: "TEST_FAIL_SOMETIMES",
      arg: "test-fail-sometimes"
    },
    slowResponse: {
      doc: "Add N milliseconds to the response time for PUT /data/...",
      format: "int",
      default: 0,
      env: "TEST_SLOW_RESPONSE",
      arg: "test-slow-response"
    }
  },
  statsdPrefix: {
    doc: "Prefix for statsd messages, also indicates we should use statsd",
    format: String,
    default: "",
    env: "STATSD_PREFIX",
    arg: "statsd-prefix"
  },
  setCache: {
    doc: "Set Cache-Control headers",
    format: Boolean,
    default: true,
    env: "SET_CACHE",
    arg: "set-cache"
  },
  disableControllerTasks: {
    doc: "If true, then do not run migrations and periodic tasks on this server instance",
    format: Boolean,
    default: false,
    env: "DISABLE_CONTROLLER_TASKS",
    arg: "disable-controller-tasks"
  },
  forceAbTests: {
    doc: "Force AB tests, looks like 'testName=value testName2=value'",
    format: String,
    default: "",
    env: "FORCE_AB_TESTS",
    arg: "force-ab-tests"
  },
  disableSearch: {
    doc: "If true, then hide the search bar",
    format: Boolean,
    default: true,
    env: "DISABLE_SEARCH",
    arg: "disable-search"
  },
  cdn: {
    doc: "CDN URL prefix, e.g. 'https://somecdn.com/mysite'; links will be rewritten as https://somecdn.com/mysite/static/style.css",
    format: String,
    default: "",
    env: "CDN",
    arg: "cdn"
  }
});

conf.validate({ allowed: "strict" });

module.exports = conf;

import { SpecReporter } from 'jasmine-spec-reporter'

import 'jasmine'

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: { displayPending: true }
  })
)

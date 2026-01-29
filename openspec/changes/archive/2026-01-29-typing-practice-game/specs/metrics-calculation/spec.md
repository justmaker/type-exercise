## ADDED Requirements

### Requirement: WPM calculation
The system SHALL calculate words per minute using the formula: (total characters typed / 5) / elapsed time in minutes. This is the standard WPM calculation used by typing tests.

#### Scenario: WPM calculated after test
- **WHEN** the user completes the typing test
- **THEN** the system calculates WPM as (characters typed / 5) / minutes elapsed

#### Scenario: WPM with partial minute
- **WHEN** the user completes a test in 45 seconds (0.75 minutes) typing 150 characters
- **THEN** the WPM is calculated as (150 / 5) / 0.75 = 40 WPM

### Requirement: Accuracy calculation
The system SHALL calculate accuracy as the percentage of correctly typed characters out of total characters typed.

#### Scenario: Perfect accuracy
- **WHEN** the user types all characters correctly
- **THEN** the accuracy is 100%

#### Scenario: Partial accuracy
- **WHEN** the user types 90 correct characters and 10 incorrect characters
- **THEN** the accuracy is 90%

### Requirement: Timer tracking
The system SHALL track elapsed time from the first keystroke until test completion. The timer SHALL NOT start until the user begins typing.

#### Scenario: Timer starts on first keystroke
- **WHEN** the user types their first character
- **THEN** the timer begins counting

#### Scenario: Timer stops on completion
- **WHEN** the user types the final character of the passage
- **THEN** the timer stops and the elapsed time is recorded

### Requirement: Error counting
The system SHALL count the number of incorrectly typed characters during the test.

#### Scenario: Error counted
- **WHEN** the user types a character that does not match the expected character
- **THEN** the error count increases by one

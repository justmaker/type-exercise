## Requirements

### Requirement: Display target text
The system SHALL display a passage of text for the user to type. The passage SHALL be clearly visible and readable.

#### Scenario: Page load shows passage
- **WHEN** the user loads the page
- **THEN** a passage of text is displayed in a designated area

### Requirement: Text input area
The system SHALL provide a text input area where users can type. The input area SHALL be focused and ready for typing when the page loads.

#### Scenario: Input area is ready
- **WHEN** the page loads
- **THEN** the text input area is visible and focused

### Requirement: Real-time character highlighting
The system SHALL highlight characters in the target text as the user types. Correct characters SHALL be highlighted in green. Incorrect characters SHALL be highlighted in red.

#### Scenario: Correct character typed
- **WHEN** the user types a character that matches the target
- **THEN** that character in the target text is highlighted green

#### Scenario: Incorrect character typed
- **WHEN** the user types a character that does not match the target
- **THEN** that character in the target text is highlighted red

### Requirement: Test completion detection
The system SHALL detect when the user has typed the entire passage and automatically end the test.

#### Scenario: User completes passage
- **WHEN** the user types the final character of the passage
- **THEN** the test ends and results are displayed

### Requirement: Results display
The system SHALL display the test results including WPM and accuracy percentage when the test ends.

#### Scenario: Results shown after completion
- **WHEN** the test ends
- **THEN** the WPM and accuracy percentage are displayed to the user

### Requirement: Restart capability
The system SHALL allow the user to restart the test after completion.

#### Scenario: User restarts test
- **WHEN** the user clicks a restart button after completing a test
- **THEN** the test resets with a new or same passage and the user can type again

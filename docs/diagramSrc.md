```mermaid
flowchart TD
    %% Pull Request Starts the Process
    PR[Pull Request]:::start --> GHA[GitHub Actions Workflow]:::process

    %% GitHub Actions Workflow
    GHA --> Trigger[Trigger: Pull Request / Push]:::trigger
    Trigger --> Check[Check Branch Protection Rules]:::check
    Check -->|Pass| CI[Run CI Pipeline]:::ci
    CI -->|Fail| Block[Block Merge]:::block

    %% Continuous Integration Process
    CI --> Setup[Setup Node.js Environment]:::process
    Setup --> Install[Install Dependencies]:::process
    Install --> Quality[Run Code Quality Checks]:::quality
    Quality --> Format[Check Code Formatting]:::quality
    Quality --> Lint[Run Linter]:::quality
    Quality --> Tests[Execute Tests]:::tests

    %% Test Details
    Tests --> Jest[Run Unit Tests]:::tests
    Jest --> Coverage[Generate Coverage Report]:::tests

    %% Decision Box
    Tests -->|Pass| Decision{"All Tests Passed?"}:::decision
    Decision -->|Yes| Review[Ready for Review]:::review
    Decision -->|No| Fix[Fix Issues]:::fix

    %% Iterative Loop
    Fix -->|Resubmit| PR

    %% Review and Merge Workflow
    Review --> Merge[Merge to Main Branch]:::merge
    Merge -->|Fail| Rollback[Rollback Changes]:::rollback
    Merge -->|Success| Deploy[Deploy to Production]:::deploy

    %% Styling
    classDef start fill:#2a9d8f,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef process fill:#457b9d,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef trigger fill:#264653,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef check fill:#264653,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef ci fill:#e76f51,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef block fill:#e63946,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef quality fill:#f4a261,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef tests fill:#e9c46a,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef decision fill:#e9c46a,stroke:#264653,stroke-width:2px,shape:triangle,color:#ffffff
    classDef review fill:#2a9d8f,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef merge fill:#2a9d8f,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef rollback fill:#e63946,stroke:#264653,stroke-width:2px,color:#ffffff
    classDef deploy fill:#2a9d8f,stroke:#264653,stroke-width:2px,color:#ffffff

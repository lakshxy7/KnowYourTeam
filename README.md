Here is a comprehensive, portfolio-ready README.md. It highlights the full scope of the application, including the new Project Management module, and explains the architectural decisions clearly.
KnowYourTeam 📱

KnowYourTeam is a production-grade corporate employee directory and project management application. It bridges the gap between finding colleagues and organizing them into functional teams.

The app features a robust Offline-First architecture, ensuring that critical contact information and project details are available even without an internet connection.
🚀 Features
📖 Corporate Directory

    Infinite Scroll: Efficiently browses thousands of employees using paginated API requests.

    Smart Search: Client-side filtering by Name or Department.

    Offline Mode: Detects network loss and serves cached data automatically, preventing data wipes on refresh.

📂 Project Management (New!)

    Create Projects: Define new initiatives with a Name, Manager, and Description.

    Team Builder: Search and add members to a project, assigning specific roles (e.g., "Frontend Dev", "QA").

    One-Tap Communication: Email the entire project team instantly with a pre-filled subject line.

❤️ Personalization

    My Team: A persisted "Favorites" list to keep close contacts accessible.

    Department Filtering: Dedicated grid view to browse employees by specific verticals (Engineering, Sales, Marketing).

📞 Quick Actions

    Deep Linking: Integration with native Phone and Mail apps.

    Smart Fallback: Tries to open Gmail specifically; falls back to the system default mail app if unavailable.

🛠 Tech Stack & Rationale
Technology	Purpose	Why I chose it
React Native (CLI)	Framework	Provides full control over native modules and build configurations.
TypeScript	Language	Ensures type safety for API responses and Redux state, reducing runtime errors.
Redux Toolkit	State	Simplifies complex state logic (Slices) and async data fetching (Thunks).
Redux Persist	Storage	Persists the Directory, Team, and Project lists to AsyncStorage for offline access.
React Navigation	Routing	Industry standard for handling complex nested navigators (Tabs inside Stack).
NetInfo	Network	Monitors connectivity to trigger "Offline Mode" UI states.
📂 Project Structure

The project follows a scalable src architecture to separate concerns, making it easy for teams to collaborate.
Plaintext

src/
├── assets/         # Images and Icons (PNGs)
├── components/     # Reusable UI (UserListItem, InfoRow)
├── navigation/     # Stack & Tab Navigators configuration
├── redux/          # Global State Management
│   ├── slices/     # Feature-based logic (directory, projects, team)
│   ├── hooks.ts    # Typed hooks (useAppDispatch, useAppSelector)
│   └── store.ts    # Store configuration & Persistence setup
├── screens/        # Main Application Screens
│   ├── CreateProjectScreen.tsx  # Form with User Picker Modal
│   ├── DirectoryScreen.tsx      # Infinite Scroll List
│   └── ...
├── services/       # API Configuration (Axios instance)
├── types/          # TypeScript Interfaces (User, Project, API Response)
└── utils/          # Helper functions

⚙️ Installation & Setup
Prerequisites

    Node.js > 18

    Watchman

    iOS: Xcode & CocoaPods

    Android: Android Studio & JDK 17

Step 1: Clone & Install
Bash

git clone https://github.com/lakshxy7/KnowYourTeam.git
cd KnowYourTeam
npm install

Step 2: iOS Dependencies (Mac Only)
Bash

cd ios
pod install
cd ..

Step 3: Run the App

Start Metro Bundler:
Bash

npm start

Run on iOS Simulator:
Bash

npm run ios

Run on Android Emulator:
Bash

npm run android

🧠 Key Architectural Decisions
1. Robust Offline Handling

Instead of simply showing an error when the API fails, the app uses Redux Persist combined with NetInfo.

    Logic: If NetInfo detects no connection, the "Pull-to-Refresh" action is blocked to prevent wiping the existing list. A banner notifies the user they are viewing cached data.

2. Atomic Commits & Data Consistency

The app uses a strict Redux flow. The projectsSlice manages its own state array. When a user is added to a project, we don't duplicate their full profile data unnecessarily; we reference their User object, ensuring that if their avatar updates in the future (v2 feature), it reflects across the app.
3. Native Intent Queries (Android 11+)

To ensure the "Email" and "Phone" features work on modern Android devices, the AndroidManifest.xml includes specific <queries> blocks. This allows the app to inspect if Gmail or a Dialer is installed before attempting to open them.
🔮 Future Improvements

    Edit Projects: Allow changing the manager or removing members after creation.

    User Avatars: Implement image uploading (currently uses RandomUser API URLs).

    Dark Mode: Implement a theme context to support system dark mode preferences.

    Unit Testing: Add Jest tests for the projectSlice reducers to verify role assignment logic.

📜 License

This project is open-source and available under the MIT License.
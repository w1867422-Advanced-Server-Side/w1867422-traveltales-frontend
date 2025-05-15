# Travel Tales Frontend

- **Authentication & Authorization**
    - Register / Login / Logout flows using JWT
    - Token stored in `localStorage` and auto-attached to API calls

- **Travel Blog**
    - **Create**, **edit** and **delete** travel posts
    - Attach up to 5 images per post (drag & drop or file picker)
    - Rich content editor for body text

- **Search, Filter & Sort**
    - Global search bar on every listing page
    - Search by **Title**, **Country** or **Author**
    - Sort by **Newest**, **Most Liked** or **Most Commented**

- **Infinite-Scroll & Pagination**
    - Automatic “load more” as you scroll
    - Fallback “Load more” button if IntersectionObserver isn’t supported

- **Social Features**
    - **Like** / **Dislike** posts with live counts
    - Comment on posts, view threaded comment list
    - Follow / Unfollow other travellers
    - “My Feed” shows only posts from people you follow

- **Country Data Integration**
    - Select a country when creating/editing a post
    - Displays flag, currency code and capital city

- **Theming & Responsiveness**
    - Material-UI (MUI) custom theme with travel-blue primary palette

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Docker](#Docker)

---

## Prerequisites

- Node.js 14+
- npm or yarn
- (optional) Docker & Docker Compose

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/w1867422-Advanced-Server-Side/w1867422-traveltales-frontend.git
   cd w1867422-traveltales-frontend

2. **Install Dependencies**
    ```bash
   npm install

3. **Run in Development**
    ```bash
   npm start

Opens at http://localhost:5000.

## Docker
**A Dockerfile and .dockerignore are included for containerization.**

1. **Build the image**

    ```bash
   docker build -t traveltales-frontend .

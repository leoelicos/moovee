# moovee   <a href="https://mooovee.vercel.app/">![x](https://img.shields.io/badge/>-0?label=try%20the%20app&style=for-the-badge&labelColor=white&color=purple)</a>

![OMDB](https://img.shields.io/badge/17-0?label=OMDB&style=for-the-badge&labelColor=white&color=black) ![YouTube Data Api](https://img.shields.io/badge/v3-0?label=YouTube%20Data%20API&style=for-the-badge&labelColor=white&color=black) ![TMDB Api](https://img.shields.io/badge/v3-0?label=TMDB%20API&style=for-the-badge&labelColor=white&color=black)

## Description

Select and watch movie trailers.

The team that made the original app is credited below and its workflow was coordinated on [GitHub Projects](https://github.com/umairkhalid/movie-planner/projects/1).

While making the app, we made fetch calls to third-party APIs like `OMDB API` and `YouTube Data API`, learned about a framework called `Materialize` and used it to implement a modal, some buttons and a loading animation.

I have since refactored the application to use `React`, changed the site host to `Vercel`, and handled in a global React `useContext`.

I changed the splash screen to incorporate `Popular Today` using TMDB's [Popular API](https://developer.themoviedb.org/reference/movie-popular-list) and linked it to searchable `OMDB` query.

Memoization, and handling of loading state and error states have been factored in.

## Table of Contents

- [Usage](#usage)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Credits](#credits)
- [License](#license)

## Usage

Deployed on [Vercel](https://mooovee.vercel.app/).

## Documentation

- API

  - [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list)
  - [The Open Movie Database API](https://www.omdbapi.com/)
  - [Iframe Player parameters](https://developers.google.com/youtube/player_parameters)

## Credits

| Contributors                                   | Original Roles              | Tasks                    |
| ---------------------------------------------- | --------------------------- | ------------------------ |
| [Umair Khalid](https://github.com/umairkhalid) | Project Manager / Developer | Rendering, Design        |
| [Elsie Lawrie](https://github.com/ElsieMay)    | Developer                   | Rendering, Design        |
| [Xuan Huy Bui](https://github.com/HuyBui1987)  | Developer                   | Rendering, Local Storage |
| [Leo Wong](https://github.com/leoelicos)       | Developer                   | APIs                     |

## License

Licensed under the [MIT License](./LICENSE).

## Version history

[Version 1](https://github.com/umairkhalid/movie-planner) was made by the original team (credits above)

**Version 2** was my refactor that incorporated React, now taken offline

[Version 3](https://mooovee.vercel.app/), the current version, was my optimization that minimized calls to OMDB, added TMDB splash screen and better control of state.

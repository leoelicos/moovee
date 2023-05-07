const mockMovies = [
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BNGQzZGQxZTctMzE2Mi00OGFiLTg2ZjQtZTAwYzMyMjExN2JiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
    title: 'That Obscure Object of Desire',
    esrb: 'R',
    year: '1977',
    genre: 'Comedy, Drama, Romance',
    actors: 'Fernando Rey, Carole Bouquet, Ángela Molina',
    plot: 'Recounted in flashback are the romantic perils of Mathieu, a middle-aged French sophisticate as he falls for his nineteen-year-old former chambermaid Conchita.',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '7.8/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '97%'
      },
      {
        Source: 'Metacritic',
        Value: '84/100'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BYmNjODYxOTMtNTBhMS00MmVhLWFiODUtYzYxMDA1MzNmZTEyXkEyXkFqcGdeQXVyMTMxMTY0OTQ@._V1_SX300.jpg',
    title: 'The Object of My Affection',
    esrb: 'R',
    year: '1998',
    genre: 'Comedy, Drama, Romance',
    actors: 'Jennifer Aniston, Paul Rudd, Kali Rocha',
    plot: "A pregnant New York City social worker begins to develop romantic feelings for her gay best friend, and decides she'd rather raise her child with him, much to the dismay of her overbearing boyfriend.",
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '6.0/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '53%'
      },
      {
        Source: 'Metacritic',
        Value: '51/100'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BYThjMGE5MzktYjVjNy00ZWJkLWFiMTAtNjk0YzI1NzBhODM5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    title: 'Love Object',
    esrb: 'R',
    year: '2003',
    genre: 'Drama, Horror, Romance',
    actors: 'Desmond Harrington, Melissa Sagemiller, Udo Kier',
    plot: "Kenneth is a socially awkward office worker who has little experience with romance. He buys a life-like sex doll in an attempt to rid him of his loneliness, but soon finds there may be a dark side to 'Nikki'.",
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '6.3/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '38%'
      },
      {
        Source: 'Metacritic',
        Value: '45/100'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BMTI2MzQ4ODQ3MV5BMl5BanBnXkFtZTcwODQyMzgyMQ@@._V1_SX300.jpg',
    title: 'The Object of Beauty',
    esrb: 'R',
    year: '1991',
    genre: 'Comedy, Crime, Drama',
    actors: 'John Malkovich, Andie MacDowell, Lolita Davidovich',
    plot: "This story is about a ne'er-do-well and his girlfriend as they search for a thief.",
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '5.6/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '77%'
      },
      {
        Source: 'Metacritic',
        Value: '58/100'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BOTU5MTI4NTM3NF5BMl5BanBnXkFtZTcwMjMxMTgxMQ@@._V1_SX300.jpg',
    title: 'Mysterious Object at Noon',
    esrb: 'Not Rated',
    year: '2000',
    genre: 'Documentary, Drama, Fantasy',
    actors: 'Duangjai Hiransri, Kome Kongkiat Komesiri, Saisiri Xoomsai',
    plot: 'A film crew documents a folk story-exquisite corpse combination by random Thai people; the story is reenacted.',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '6.7/10'
      },
      {
        Source: 'Rotten Tomatoes',
        Value: '89%'
      },
      {
        Source: 'Metacritic',
        Value: '69/100'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BNjI1ZDRlODAtYmIwMy00YzUyLTgxOTAtMjQ2YjQwMTU0NzEwXkEyXkFqcGdeQXVyMjQ0NjIyMjI@._V1_SX300.jpg',
    title: 'An Object at Rest',
    esrb: 'N/A',
    year: '2015',
    genre: 'Animation, Short, Adventure',
    actors: 'Miles Hartfelder, Zero Pilnik, Sarah Parsons',
    plot: 'The story of a rock facing its greatest adversary: human civilization.',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '7.5/10'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BZjkzNGQzODMtMDM4MS00YTU2LWI2M2UtN2I2NTA2MDUzZmRmXkEyXkFqcGdeQXVyMTE5MzU1Njkw._V1_SX300.jpg',
    title: 'Object of Obsession',
    esrb: 'R',
    year: '1994',
    genre: 'Drama',
    actors: 'Scott Valentine, Erika Anderson, Elizabeth Whitcraft',
    plot: 'A mysterious wrong number leads Margaret on a journey that takes her to the edge of sexual desire and obsession. One phone call leads her into a sensual affair with a stranger who fills her nights with passion. At first their affa...',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '4.3/10'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc3MDI2MTA2Ml5BMl5BanBnXkFtZTgwMzgzNDE2MjE@._V1_SX300.jpg',
    title: 'The Transcendental Object at the End of Time',
    esrb: 'N/A',
    year: '2014',
    genre: 'Documentary',
    actors: 'Terence McKenna',
    plot: 'An audio-visual journey through the mind of Terence McKenna.',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '9.2/10'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BYTRlMjI1NDctZjQzZi00MGU4LWEwNWMtMGVkYjYwNWI2ZmZlXkEyXkFqcGdeQXVyMjY3ODU0Mzk@._V1_SX300.jpg',
    title: 'An Impossibly Small Object',
    esrb: 'N/A',
    year: '2018',
    genre: 'Drama, Fantasy',
    actors: 'Lucia, Chen-Hung Chung, David Verbeek',
    plot: 'A photographer takes a photo of a little girl on the nightly streets of Taipei. After this the memory of his own childhood starts to come back to him more and more and becomes intertwined with the identity of the girl, as looking ...',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '6.3/10'
      }
    ]
  },
  {
    poster: 'https://m.media-amazon.com/images/M/MV5BMWI0Yzg0YjktYjhmYy00ODg4LWI1OTgtNDU5MjNjNzhmN2Q2XkEyXkFqcGdeQXVyMDIzNjU0NA@@._V1_SX300.jpg',
    title: 'Object of Desire',
    esrb: 'N/A',
    year: '1990',
    genre: 'Crime, Drama, Romance',
    actors: 'Traci Lords, John Vernon, Nick Cassavetes',
    plot: 'A beautiful young soap opera star is stalked and terrorized by an obsessive admirer.',
    rating: [
      {
        Source: 'Internet Movie Database',
        Value: '6.2/10'
      }
    ]
  }
]

export default mockMovies

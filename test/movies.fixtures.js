function makeMoviesArr() {
  return [
    {
      id: 1,
      datecreated: new Date().toISOString(),
      title: "Tom & Jerry",
      poster_path: "/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
      vote_average: 7.7,
    },
    {
      id: 2,
      datecreated: new Date().toISOString(),
      title: "Coming 2 America",
      poster_path: "/nWBPLkqNApY5pgrJFMiI9joSI30.jpg",
      vote_average: 7.1,
    },
    {
      id: 3,
      datecreated: new Date("1919-12-22T16:28:32.615Z"),
      title: "Monster Hunter",
      poster_path: "/1UCOF11QCw8kcqvce8LKOO6pimh.jpg",
      vote_average: 7.3,
    },
  ];
}

module.exports = { makeMoviesArr };

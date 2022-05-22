import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

//Provider, cosumer - using Provider. This is just like Global state

//whatever is put it in value will be provided or get access from other components
const GithubProvider = ({ children }) => {
  //return array of two values
  const [githubUser, setGithubUser] = useState(mockUser);
  const [followers, setFollowers] = useState(mockFollowers);
  const [repos, setRepos] = useState(mockRepos);

  //request loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    //toggleError
    toggleError(); //since we gave default value, no arg here
    setLoading(true);
    //fetching user's url
    const res = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (res) {
      setGithubUser(res.data);

      const { login, followers_url } = res.data;
      // ==== Below works but takes two separate requests===
      //repos
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((res) =>
      //   setRepos(res.data)
      // );
      //followers
      // axios(`${followers_url}?per_page_100`).then((res) =>
      //   setFollowers(res.data)
      // );
      // === Below will requests concurrently ===
      //Promise, await while two requests at the same time
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page_100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user!");
    }
    checkRequests();
    setLoading(false);
  };

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        // remaining = 0;
        setRequests(remaining);

        if (remaining === 0) {
          //throw error
          toggleError(true, "sorry, you have exceeded your hourly rate limit");
        }
      })
      .catch((error) => console.log(error));
  };

  //error function
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        repos,
        githubUser,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };

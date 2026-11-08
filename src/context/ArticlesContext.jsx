import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext(null);

function getArticlesForUser(articlesByUser, username) {
  return username && Object.hasOwn(articlesByUser, username)
    ? articlesByUser[username]
    : [];
}

export function ArticlesProvider({ children }) {
  const { user } = useAuth();
  const [savedArticlesByUser, setSavedArticlesByUser] = useState({});
  const username = user?.username;

  const saveArticle = (article) => {
    if (!username) {
      return;
    }

    setSavedArticlesByUser(prev => {
      const userArticles = getArticlesForUser(prev, username);
      if (userArticles.some(savedArticle => savedArticle.url === article.url)) {
        return prev;
      }

      return { ...prev, [username]: [...userArticles, article] };
    });
  };

  const removeArticle = (url) => {
    if (!username) {
      return;
    }

    setSavedArticlesByUser(prev => {
      const userArticles = getArticlesForUser(prev, username);
      return {
        ...prev,
        [username]: userArticles.filter(article => article.url !== url),
      };
    });
  };

  const isArticleSaved = (url) => {
    return getArticlesForUser(savedArticlesByUser, username)
      .some(article => article.url === url);
  };

  const getUserSavedArticles = () => getArticlesForUser(savedArticlesByUser, username);
  const getAllUserArticles = () => savedArticlesByUser;

  return (
    <ArticlesContext.Provider
      value={{
        saveArticle,
        removeArticle,
        isArticleSaved,
        getUserSavedArticles,
        getAllUserArticles,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
}
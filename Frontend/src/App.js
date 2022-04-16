import React , { useCallback,useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Home from './shared/pages/home';
import Users from './users/pages/users-in-gym';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPost from './UserPosts/pages/userPosts';
import NewPost from './UserPosts/pages/newPost';
import UpdatePost from './UserPosts/pages/updatePost';
import Auth from './users/pages/Auth';
import UserFeed from './UserPosts/pages/userFeed';
import { AuthContext } from './shared/context/auth-context';
import Checkin from './UserPosts/pages/checkin';
import AdminScanner from './admin/Pages/scanner';
import AdminAdd from './admin/Pages/addUser';
import Admin from './admin/Pages/admin';
import AdminScannerCheckout from './admin/Pages/checkout';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);


  
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({userId: uid, token:token, expiration: tokenExpirationDate.toISOString()})
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null)
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
     logoutTimer = setTimeout(logout, remainingTime);
    } else{
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData =  JSON.parse(localStorage.getItem('userData'));
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
   }, [login])


  let routes;
  if(token){
    routes = (
      <Switch>
        <Route path="/" exact>
      <Home />
      </Route>
      <Route path="/users-in-gym" exact>
      <Users />
      </Route>
      <Route path="/feed" exact>
      <UserFeed />
      </Route>
      <Route path="/:userId/posts" exact>
      <UserPost />
      </Route>
      <Route  path="/post/new" >
      <NewPost />
      </Route>
      <Route  path="/post/:postId" >
      <UpdatePost />
      </Route>
      <Route  path="/checkin/:userId" >
      <Checkin />
      </Route>
      <Route  path="/admin-scan" >
      <AdminScanner />
      </Route>  
      <Route  path="/admin" >
      <Admin />
      </Route>  
    <Redirect to = "/"/>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
      <Home />
      </Route>
      <Route path="/users-in-gym" exact>
      <Users />
      </Route>
      <Route path="/auth" exact>
      <Auth />
      </Route>   
      <Route  path="/admin-scan" >
      <AdminScanner />
      </Route>
      <Route  path="/admin-checkout" >
      <AdminScannerCheckout />
      </Route>
      <Route  path="/admin-add" >
      <AdminAdd />
      </Route>    
      <Route  path="/admin" >
      <Admin />
      </Route>
    <Redirect to = "/auth"/>
      </Switch>
    );
  }
    return (
    <AuthContext.Provider value = {{isLoggedIn: !!token, token:token, userId:userId, login: login, logout: logout}}>
    <Router>
    <MainNavigation />
    <main>
   
    {routes}
  
    </main>
  </Router>
  </AuthContext.Provider>
  );
};

export default App;

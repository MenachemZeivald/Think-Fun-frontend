import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AddCategory from './components/admin/addCategory';
import CategoriesList from './components/admin/categoriesList';
import EditCategory from './components/admin/editCategory';
import UsersList from './components/admin/usersList';
import RequireAuth from './components/admin/requireAuth';
import Unauthorized from './components/user/unauthorized';
import PersistLogin from './components/admin/persistLogin.';
import AddMatchingGame from './components/admin/addMatchingGame';
import EditMatchingGame from './components/admin/editMatchingGame';

import MainNav from './components/MainNav';
import LoginPage from './components/Login/LoginPage';
import Stat from './components/Stat';
import LeaderBoard from './components/LeaderBoard';
import TicTacToe from './components/TicTacToe/TicTacToe';
import MatchingGame from './components/MatchingGame/MatchingGame';
import Checkers from './components/Checkers/Checkers';
import NoPage from './components/NoPage';
import Account from './components/Login/AccountForm';
import Home from './components/Home';

import './App.css';
import Links from './components/admin/links';
import MatchingGameList from './components/admin/matchingGameList';
import ForgotPassword from './components/Login/forgotPassword';

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<MainNav />}>
				{/* public routes */}
				<Route index element={<Home />} />
				<Route path='login' element={<LoginPage />} />
				<Route path='forgotPassword' element={<ForgotPassword />} />
				<Route path='TicTacToe/:idRoom?' element={<TicTacToe />} />
				<Route path='MatchingGame' element={<MatchingGame />} />
				<Route path='Checkers' element={<Checkers />} />
				<Route path='unauthorized' element={<Unauthorized />} />
				<Route path='LeaderBoard' element={<LeaderBoard />} />
				<Route path='*' element={<NoPage />} />

				<Route path='stat' element={<Stat />} />
				{/* we want to protect these routes */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedRoles={'user'} />}></Route>
					<Route path='account' element={<Account />} />
					<Route element={<RequireAuth allowedRoles={'admin'} />}>
						<Route path='admin' element={<Links />} />
						<Route path='admin/users' element={<UsersList />} />
						<Route path='admin/categories' element={<CategoriesList />} />
						<Route path='admin/categories/new' element={<AddCategory />} />
						<Route path='admin/categories/edit/:id' element={<EditCategory />} />
						<Route path='admin/games/matchingGame' element={<MatchingGameList />} />
						<Route
							path='admin/games/matchingGame/edit/:id'
							element={<EditMatchingGame />}
						/>
						<Route path='admin/games/matchingGame/new' element={<AddMatchingGame />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

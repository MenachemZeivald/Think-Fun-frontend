import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AddCategory from './components/admin/addCategory';
import CategoriesList from './components/admin/categoriesList';
import EditCategory from './components/admin/editCategory';
import UsersList from './components/admin/usersList';
import RequireAuth from './components/admin/requireAuth';
import Unauthorized from './components/user/unauthorized';
import PersistLogin from './components/admin/persistLogin.';
import AddMemoryGame from './components/admin/addMemoryGame';
import EditMemoryGame from './components/admin/editMemoryGame';
import MemoryGameList from './components/admin/memoryGameList';

import MainNav from './components/MainNav';
import LoginPage from './components/Login/LoginPage';
import Stat from './components/Stat';
import TicTacToe from './components/TicTacToe/TicTacToe';
import MatchingGame from './components/MatchingGame/MatchingGmae';
import Checkers from './components/Checkers/Checkers';
import Cards from './components/MatchingGame/Cards';
import NoPage from './components/NoPage';
import Account from './components/Login/AccountForm';
import Home from './components/Home';

import './App.css';

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<MainNav />}>
				{/* public routes */}
				<Route index element={<Home />} />
				<Route path='login' element={<LoginPage />} />
				<Route path='TicTacToe' element={<TicTacToe />} />
				<Route path='MatchingGame' element={<MatchingGame />} />
				<Route path='MatchingGame/:cards' element={<Cards />} />
				<Route path='Checkers' element={<Checkers />} />
				<Route path='unauthorized' element={<Unauthorized />} />
				<Route path='*' element={<NoPage />} />

				{/* we want to protect these routes */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedRoles={'user'} />}>
						<Route path='stat' element={<Stat />} />
						<Route path='account' element={<Account />} />
					</Route>
					<Route element={<RequireAuth allowedRoles={'admin'} />}>
						<Route path='admin/users' element={<UsersList />} />
						<Route path='admin/categories' element={<CategoriesList />} />
						<Route path='admin/categories/new' element={<AddCategory />} />
						<Route path='admin/categories/edit/:id' element={<EditCategory />} />
						<Route path='admin/games/memoryGame' element={<MemoryGameList />} />
						<Route
							path='admin/games/memoryGame/edit/:id'
							element={<EditMemoryGame />}
						/>
						<Route path='admin/games/memoryGame/new' element={<AddMemoryGame />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

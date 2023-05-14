import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import LoadingGif from '../games/LoadingGif';

export default function MatchingGameList() {
	const nav = useNavigate();
	const location = useLocation();
	const axiosPrivate = useAxiosPrivate();
	const controller = new AbortController();

	const [arr, setArr] = useState([]);
	// const [page, setPage] = useState(1);
	const page = 1;
	const [perPage, setPerPage] = useState(10);
	const [category, setCategory] = useState('');
	const [categoriesArr, setCategoriesArr] = useState([]);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getCategories = async () => {
		try {
			const response = await axiosPrivate.get('/categories', {
				signal: controller.signal,
			});
			setCategoriesArr(response.data);
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			nav('/login', { state: { from: location }, replace: true });
		}
	};

	useEffect(() => {
		getMatchingGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, perPage, search]);

	const getMatchingGame = async () => {
		let url = `/games/matchingGame/?category=${category}&perPage=${perPage}&page=${page}&s=${search}`;
		try {
			const response = await axiosPrivate.get(url, {
				signal: controller.signal,
			});
			// console.log(response.data);
			setArr(response.data);
		} catch (err) {
			console.log(err);
			nav('/login', { state: { from: location }, replace: true });
		}
	};

	const deletion = async idDel => {
		let url = '/games/matchingGame/' + idDel;
		try {
			const response = await axiosPrivate.delete(url, {
				signal: controller.signal,
			});
			if (response.data.deletedCount) {
				console.log('app/game deleted');
				getMatchingGame();
			}
		} catch (err) {
			console.log(err);
			nav('/login', { state: { from: location }, replace: true });
		}
	};

	const editing = idEdit => {
		nav('/admin/games/matchingGame/edit/' + idEdit);
	};

	return isLoading ? (
		<LoadingGif />
	) : (
		<div className='categories-container'>
			<div className='center-container'>
				<div className='text-container'>
					<h1>List of games</h1>
				</div>
				<div className='sort-container'>
					<div className='select-container'>
						<select className='form-select' onChange={e => setCategory(e.target.value)}>
							<option value=''>categories</option>
							{categoriesArr.map(item => (
								<option key={item._id} value={item.category_id}>
									{item.name}
								</option>
							))}
						</select>
					</div>
					<div className='select-container'>
						<select className='form-select' onChange={e => setPerPage(e.target.value)}>
							<option value=''>how much</option>
							<option value='5'>5</option>
							<option value='10'>10</option>
							<option value='15'>15</option>
							<option value='20'>20</option>
							<option value='50'>50</option>
						</select>
					</div>
					<div className='search-container'>
						<input
							placeholder='search...'
							className='form-control search'
							type='text'
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<div className='table-container'>
					<table className='table table-hover'>
						<thead>
							<tr>
								<th>#</th>
								<th>Description</th>
								<th>Img url</th>
								<th>Category</th>
								<th>del/edit</th>
							</tr>
						</thead>
						<tbody>
							{arr.map((item, i) => {
								return (
									<tr key={item._id}>
										<td>{i + 1}</td>
										<td>{item.description}</td>
										<td>{item.img_url}</td>
										<td>{item.category_id}</td>
										<td className='del-edit'>
											<button
												className='btn del-btn'
												onClick={() =>
													window.confirm('Delete item?') &&
													deletion(item._id)
												}
											>
												<i className='fa-solid fa-trash'></i>
											</button>
											<button
												className='btn  edit-btn ms-2'
												onClick={() => editing(item._id)}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className='button-container'>
					<Link className='btn add-new' to='/admin/games/matchingGame/new'>
						add new category
					</Link>
				</div>
			</div>
		</div>
	);
}

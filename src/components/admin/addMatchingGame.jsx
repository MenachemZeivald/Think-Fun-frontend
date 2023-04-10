import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivet';

export default function AddmatchingGame() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const nav = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

  const onSub = (bodyData) => {
    addGames(bodyData);
  };

  const addGames = async (bodyData) => {
    try {
      const response = await axiosPrivate.post('/games/matchingGame', bodyData, {
        signal: controller.signal,
      });
      if (response.data._id) {
        console.log('Memory game added');
        nav('/admin/games/matchingGame');
      }
    } catch (err) {
      console.log(err);
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  return (
    <div className='categories-container'>
      <div className='center-container'>
        <div className='text-container'>
          <h1 className='display-6'>Add new Memory game</h1>
        </div>
        <div className='form-container'>
          <form onSubmit={handleSubmit(onSub)} id='id_form' className='shadow p-2'>
            <label>description</label>
            <input {...register('description', { minLength: 2, required: true })} className='form-control ' type='text' />
            {errors.description && <div className='text-danger'>* Enter valid description (min 2 chars)</div>}
            <label>img_url</label>
            <input {...register('img_url', { minLength: 2, required: true })} className='form-control ' type='text' />
            {errors.img_url && <div className='text-danger'>* Enter valid img_url (min 2 chars)</div>}
            <label>category_id</label>
            <input {...register('category_id', { minLength: 2, required: true })} className='form-control' type='text' />
            {errors.category_id && <div className='text-danger'>* Enter valid category_id (min 2 chars)</div>}
            <div className='button-container'>
              <button className='btn add-new'>Add new</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

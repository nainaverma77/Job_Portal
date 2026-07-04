import { setAllJobs } from "../redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}`}/api/v1/job/get?keyword=${searchedQuery}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    dispatch(setAllJobs([]));
                }
            } catch (error) {
                console.log(error);
                dispatch(setAllJobs([]));
            }
        }
        fetchAllJobs();
    }, [searchedQuery, dispatch]);
}

export default useGetAllJobs;

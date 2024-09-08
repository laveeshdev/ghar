import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MyListings() {
  const location = useLocation();
  const [userListings, setUserListings] = useState(location.state?.listings || []);
  const [showListingsError, setShowListingsError] = useState(false);

  useEffect(() => {
    if (!location.state?.listings) {
      // Fetch listings if not passed via state
      const fetchUserListings = async () => {
        try {
          const res = await fetch(`/api/user/listings/${location.state?.userId}`);
          const data = await res.json();
          if (data.success === false) {
            setShowListingsError(true);
            return;
          }
          setUserListings(data);
        } catch (error) {
          setShowListingsError(true);
        }
      };
      fetchUserListings();
    }
  }, [location.state]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>My Listings</h1>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings && userListings.length > 0 ? (
        <div className='flex flex-col gap-4'>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center'>No listings found.</p>
      )}
    </div>
  );
}
import React from 'react';
import Avatar from '../common/Avatar';

const ActiveShelters = () => {
    return (
        <div className='flex items-center'>
            <div className='flex '>
                <div>
                    <Avatar></Avatar>
                </div>
                <div className='relative right-6'>
                    <Avatar></Avatar>
                </div>
                <div className='relative right-10'>
                    <Avatar></Avatar>
                </div>
            </div>
            <p className='text-sm tracking-wide'>
                <span className='font-semibold'>15M+</span><br />
                Active Shelters <br />
                across the world
            </p>
        </div>
    );
};

export default ActiveShelters;
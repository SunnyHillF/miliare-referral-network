import React from 'react';
import { useParams } from 'react-router-dom';

const PartnerCreatedPage = () => {
  const { partnerId } = useParams();
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Partner Created</h1>
      <p>The partner with ID {partnerId} was created and an admin invite was sent.</p>
    </div>
  );
};

export default PartnerCreatedPage;

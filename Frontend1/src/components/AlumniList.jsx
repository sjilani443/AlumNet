import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const companyLogos = {
  Amazon: 'https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo-2000.png',
  Adobe: 'https://fabrikbrands.com/wp-content/uploads/Adobe-Logo-History-1a.png',
  IBM: 'https://pnghunter.com/get-logo.php?id=3844',
  Cisco: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIGLJUF2mKapkUggbszRihDaBg1b8bMphOjg&s',
  Deloitte: 'https://logos-world.net/wp-content/uploads/2021/08/Deloitte-Logo-1993-present.png',
  Oracle: 'https://fabrikbrands.com/wp-content/uploads/Oracle-Logo-History-4-864x540.png',
  Apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  Salesforce: 'https://toppng.com/uploads/preview/salesforce-transparent-logo-115525063493207zrqpiz.png',
  Google: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  Tesla: 'https://pngimg.com/d/tesla_logo_PNG12.png',
  Meta: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/1200px-Meta-Logo.png',
  Microsoft: 'https://banner2.cleanpng.com/20180409/xoe/avg7qtizi.webp',
  Netflix: 'https://banner2.cleanpng.com/20180702/qac/aax1p8e04.webp',
};

export default function AlumniList({ limit = 5, showAll = false }) {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyClick = (companyName) => {
    navigate(`/student/company/${encodeURIComponent(companyName)}`);
  };

  const handleSeeAll = () => {
    navigate('/student/companies');
  };

  const displayedCompanies = showAll ? companies : companies.slice(0, limit);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {displayedCompanies.map((company) => (
          <button
            key={company}
            onClick={() => handleCompanyClick(company)}
            className="relative group p-2 rounded-lg border transition-all duration-200 border-gray-200 hover:border-primary-300 hover:bg-gray-50"
          >
            <div className="aspect-video flex items-center justify-center p-1">
              {companyLogos[company] ? (
                <img src={companyLogos[company]} alt={company} className="max-h-10 w-auto object-contain" />
              ) : (
                <Building2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-center mt-1 font-medium text-gray-700">{company}</p>
          </button>
        ))}
      </div>

      {!showAll && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSeeAll}
            className="text-primary-600 text-sm font-bold hover:underline"
          >
            See All Companies
          </button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

export default function PageHero({ 
  title, 
  subtitle, 
  ctaText, 
  ctaHref,
  className = '' 
}: PageHeroProps) {
  return (
    <div className={`text-right mb-8 ${className}`}>
      <h1 className="text-2xl font-bold text-tawreed-text-dark mb-2">
        {title}
      </h1>
      <p className="mt-1 text-sm text-gray-500 mb-6">
        {subtitle}
      </p>
      <div className="flex justify-center">
        <Link 
          to={ctaHref}
          className="bg-tawreed-green text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
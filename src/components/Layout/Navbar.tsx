//src/components/Layout/Navbar.tsx

import React from 'react';
import { LogOut, Bell, Settings } from 'lucide-react';
import { User } from '../../types';
import { roleLabels } from '../../data/mockData';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}



export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [badgeValue, setBadgeValue] = useState<number | null>(null);
  const [codingLabUrl, setCodingLabUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadgeValue = async () => {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from("clients")
        .select("badge_value,coding_lab_url,company_email")
        .eq("company_email", user.email)
        .single();

      if (error) {
        console.error("Error fetching badge value:", error.message);
        return;
      }

      if (data?.badge_value !== null) {
        setBadgeValue(data.badge_value);
      }
      if (data?.coding_lab_url) {
        setCodingLabUrl(data.coding_lab_url);
      }
    };

    fetchBadgeValue();
  }, [user?.email]);


  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img className="text-xl font-bold text-gray-900 h-8 w-36" src="https://storage.googleapis.com/solwizz/website_content/Black%20Version.png" alt="agg" />
          </div>
          <div className="hidden md:block h-6 w-px bg-gray-300">
          </div>
          <div className="hidden md:block">
            <span className="text-sm text-gray-500">Ticketing & Operations</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-gray-300">
          </div>
          <div className="text-sm  text-gray-500 bg-gray-100 border border-green-200">
            <div className='text-center'>🚀 ApplyWizz Ticketing Tool – Beta Version Launched!</div>
            <div className='px-4 text-center'>
              <p>
                You’re now using the beta version of our internal ticketing system. 🎉
                We’re testing and improving how tickets are created, tracked, and resolved across teams.
              </p>
              <p>
                💬 Found a bug or have feedback? Let us know  — your input helps us make it better!
                — ApplyWizz Ops & Tech Team
              </p>
            </div>
          </div>
          <div></div>
        </div>

        <div className="flex items-center space-x-4">

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}{user.role !== "client" && (`  ( ${roleLabels[user.role]} )`)}</div>
              <div className="text-sm font-medium text-gray-900">{user.email}</div>
              {/* <div className="text-xs text-gray-500">{}</div> */}
            </div>
            {(user.role === 'client' && badgeValue) && ( // show the button only if the user is a client and has a badgeValue
              <button
                className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded-lg font-medium"
                onClick={() => {
                  const uid = encodeURIComponent(user.id ?? user.email);
                  if (codingLabUrl==="vivek") {
                    window.open(`/api/fermion-redirectvivek?uid=${uid}`, '_blank', 'noopener'); //uid
                  }else if (codingLabUrl==="be3") {
                    window.open(`/api/fermion-redirectbe3?uid=${uid}`, '_blank', 'noopener'); //uid
                  }
                  else {
                    window.open(`/api/fermion-redirect?uid=${uid}`, '_blank', 'noopener'); //uid
                  }}
                }
              >
                Coding Lab
              </button>
            )}

          </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Log out"
              aria-label="Log out"
            >
              <div className="flex flex-col items-center">
                <LogOut className="h-6 w-6" />
                <p className='text-xs'>Log Out</p>
              </div>
            </button>
        </div>
      </div>
    </nav>
  );
};

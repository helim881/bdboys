"use client";

import Link from "next/link"; // Use "next/link" for Next.js or "<a>" for standard React

const AdminPanel = () => {
  const adminItems = [
    {
      title: "Pending Posts (0)",
      href: "/admin/pending-post",
      desc: "Here's Your Pending Posts List. Currently You Have 0 Post. For Review Enter This Dept.",
    },
    {
      title: "Active Posts (212)",
      href: "/admin/active-post",
      desc: "Here's Your Active Posts List. Currently You Have 212 Post. Review It For Edit/Delete.",
    },
    {
      title: "Category Management (22)",
      href: "/admin/category",
      desc: "Manage Your Category From Here. Currently You Have 22 Category. Review It For Edit/Delete.",
    },
    {
      title: "Pending Sms (0)",
      href: "/admin/pending-sms",
      desc: "Here's Your Pending Sms List. Currently You Have 0 Post. Review It For Edit/Delete.",
    },
    {
      title: "Active Sms (7887)",
      href: "/admin/active-sms",
      desc: "Here's Your Active Posts List. Currently You Have 7887 Post. Review It For Edit/Delete.",
    },
    {
      title: "Sms Category Management (4)",
      href: "/admin/sms-category",
      desc: "Manage Your Sms Category From Here. Currently You Have 4 Category. Review It For Edit/Delete.",
    },
    {
      title: "User Management (182)",
      href: "/admin/users",
      desc: "Manage Your User From Here. Currently You Have 182.",
    },

    {
      title: "Ads Management",
      href: "/admin/ads-manager",
      desc: "Manage Your Ads From Here.",
    },

    {
      title: "System Management",
      href: "/admin/settings",
      desc: "Manage Site Default System Setting.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-sm">
      {/* Search Bars */}
      {/* <div className="p-2 space-y-2 border-b border-gray-300">
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Search Posts.."
            className="h-8 rounded-none border-gray-300 shadow-none focus-visible:ring-0"
          />
          <Button className="w-fit h-7 px-4 rounded-none bg-[#c12e2a] hover:bg-[#a12623] text-xs font-normal">
            Search
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <Input
            defaultValue="bdboysto"
            className="h-8 rounded-none border-gray-300 shadow-none focus-visible:ring-0"
          />
          <Button className="w-fit h-7 px-4 rounded-none bg-[#c12e2a] hover:bg-[#a12623] text-xs font-normal">
            Search
          </Button>
        </div>
      </div> */}

      {/* Admin Panel Gray Header */}
      <div className="bg-[#f5f5f5] border-y border-gray-300 px-3 py-1.5 font-bold text-[#333]">
        Admin Panel
      </div>

      {/* Link List */}
      <div className="flex flex-col">
        {adminItems.map((item, index) => (
          <div
            key={index}
            className="px-3 py-2 border-b border-gray-100 last:border-b-gray-300"
          >
            <Link
              href={item.href}
              className="text-[#337ab7] font-semibold text-[14px] hover:text-[#23527c] hover:underline block w-fit"
            >
              {item.title}
            </Link>
            <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

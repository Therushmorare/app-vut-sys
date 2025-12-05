"use client"

import { StudentProvider } from '/constants/context';

export default async function PortalLayout({ children }) {
  const session = await getSession();
  
  return (
    <StudentProvider initialStudent={session.student}>
      <Header />
      <Navigation />
      {children}
    </StudentProvider>
  );
}
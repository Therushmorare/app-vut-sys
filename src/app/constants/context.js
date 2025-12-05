"use client"

import { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export function StudentProvider({ children, initialStudent }) {

  const calculateProgress = (updatedStudent) => {
    const requiredDocs = ['idDocument', 'proofOfResidence', 'academicTranscript', 'cv', 'bankStatement'];
    const uploadedDocs = updatedStudent.uploadedDocuments || {};

    const allDocsUploaded = requiredDocs.every(doc => uploadedDocs[doc]);

    const allDocsVerified = allDocsUploaded && requiredDocs.every(
      doc => uploadedDocs[doc]?.status === 'Verified'
    );

    return {
      documentsComplete: allDocsVerified,
      documentsUploaded: allDocsUploaded,
      verifiedCount: requiredDocs.filter(doc => uploadedDocs[doc]?.status === 'Verified').length,
      uploadedCount: requiredDocs.filter(doc => uploadedDocs[doc]).length,
      totalRequired: requiredDocs.length
    };
  };

  const [student, setStudent] = useState(() => {
  if (!initialStudent) return null;
  
  const progress = calculateProgress(initialStudent);
  return {
    ...initialStudent,
    ...progress
  };
});

  const updateStudent = (updates) => {
    setStudent(prev => {
      const updated = { ...prev, ...updates };
      const progress = calculateProgress(updated);
      
      return {
        ...updated,
        ...progress,
        status: progress.documentsComplete && updated.setaAllocation && updated.placement 
          ? 'Active' 
          : 'Pending'
      };
    });
  };

  const updateDocuments = (documents) => {
    updateStudent({ uploadedDocuments: documents });
  };

  const uploadDocument = (docKey, docData) => {
    setStudent(prev => {
      const uploadedDocs = {
        ...(prev.uploadedDocuments || {}),
        [docKey]: {
          ...docData,
          uploadDate: new Date().toISOString(),
          status: 'Pending Verification'
        }
      };

      const updated = { ...prev, uploadedDocuments: uploadedDocs };
      const progress = calculateProgress(updated);

      const notification = {
        id: Date.now(),
        title: 'Document Uploaded',
        message: `Your ${docKey.replace(/([A-Z])/g, ' $1').trim()} has been uploaded and is pending verification.`,
        date: new Date().toISOString(),
        read: false,
        type: 'document'
      };

      return {
        ...updated,
        ...progress,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const signAgreement = (agreementKey) => {
    setStudent(prev => {
      const uploadedDocs = {
        ...(prev.uploadedDocuments || {}),
        [agreementKey]: {
          ...(prev.uploadedDocuments?.[agreementKey] || {}),
          signed: true,
          signedDate: new Date().toISOString(),
          status: 'Signed'
        }
      };

      const notification = {
        id: Date.now(),
        title: 'Agreement Signed',
        message: `Your ${agreementKey === 'setaAgreement' ? 'SETA' : 'Placement'} agreement has been successfully signed.`,
        date: new Date().toISOString(),
        read: false,
        type: 'agreement'
      };

      return {
        ...prev,
        uploadedDocuments: uploadedDocs,
        [agreementKey === 'setaAgreement' ? 'setaAgreementSigned' : 'placementAgreementSigned']: true,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const allocateSeta = (setaData) => {
    setStudent(prev => {
      const notification = {
        id: Date.now(),
        title: 'SETA Allocated',
        message: `You have been allocated to ${setaData.setaName}. Please download and sign your agreement.`,
        date: new Date().toISOString(),
        read: false,
        type: 'seta'
      };

      return {
        ...prev,
        setaAllocation: setaData,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const assignPlacement = (placementData) => {
    setStudent(prev => {
      const notification = {
        id: Date.now(),
        title: 'Placement Assigned',
        message: `You have been placed at ${placementData.companyName}. Please review and sign your placement agreement.`,
        date: new Date().toISOString(),
        read: false,
        type: 'placement'
      };

      return {
        ...prev,
        placement: placementData,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const markNotificationRead = (notificationId) => {
    setStudent(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  return (
    <StudentContext.Provider value={{
      student,
      updateStudent,
      updateDocuments,
      uploadDocument,
      signAgreement,
      allocateSeta,
      assignPlacement,
      markNotificationRead
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
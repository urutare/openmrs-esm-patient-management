import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast, showNotification } from '@openmrs/esm-framework';

import type { BedFormData } from '../types';
import { useBedType, editBed } from './bed-administration.resource';
import BedAdministrationForm from './bed-administration-form.component';
import { type BedAdministrationData } from './bed-administration-types';
import { useLocationsWithAdmissionTag } from '../summary/summary.resource';

interface EditBedFormProps {
  closeModal: () => void;
  editData: BedFormData;
  mutate: () => any;
}

const EditBedForm: React.FC<EditBedFormProps> = ({ closeModal, editData, mutate }) => {
  const { t } = useTranslation();
  const { data: admissionLocations } = useLocationsWithAdmissionTag();

  const headerTitle = t('editBed', 'Edit bed');
  const occupancyStatuses = ['Available', 'Occupied'];
  const { bedTypes } = useBedType();
  const availableBedTypes = bedTypes ? bedTypes : [];
  const handleCreateQuestion = useCallback(
    (formData: BedAdministrationData) => {
      const bedUuid = editData.uuid;
      const {
        bedId = editData.bedNumber,
        description = editData.description,
        occupancyStatus = editData.status,
        bedRow = editData.row.toString(),
        bedColumn = editData.column.toString(),
        location: { uuid: bedLocation = editData.location.uuid },
        bedType = editData.bedType.name,
      } = formData;
      const bedPayload = {
        bedNumber: bedId,
        bedType,
        description,
        status: occupancyStatus.toUpperCase(),
        row: parseInt(bedRow),
        column: parseInt(bedColumn),
        locationUuid: bedLocation,
      };
      editBed({ bedPayload, bedId: bedUuid })
        .then(() => {
          showToast({
            title: t('formSaved', 'Bed saved'),
            kind: 'success',
            critical: true,
            description: bedPayload.bedNumber + ' ' + t('saveSuccessMessage', 'was saved successfully.'),
          });

          mutate();
          closeModal();
        })
        .catch((error) => {
          showNotification({
            title: t('errorCreatingForm', 'Error creating bed'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
          closeModal();
        });
      closeModal();
    },
    [closeModal, mutate, editData, t],
  );

  return (
    <>
      <BedAdministrationForm
        closeModal={closeModal}
        allLocations={admissionLocations}
        availableBedTypes={availableBedTypes}
        handleCreateQuestion={handleCreateQuestion}
        headerTitle={headerTitle}
        occupancyStatuses={occupancyStatuses}
        initialData={editData}
      />
    </>
  );
};

export default EditBedForm;


{
    function declareEmergencyPlansTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            EMERGENCY_PLAN: 'Emergency plan',
            EMERGENCY_PLANS: 'Emergency plans',
            EMERGENCY_PLAN_SAVE: 'Save',
            EMERGENCY_PLAN_CANCEL: 'Cancel',
            EMERGENCY_PLAN_EDIT: 'Edit',
            EMERGENCY_PLAN_DELETE: 'Delete',
            EMERGENCY_PLAN_TITLE: 'Emergency action plan',
            EMERGENCY_PLAN_EMPTY_TITLE: 'Emergency plans not found',
            EMERGENCY_PLAN_EMPTY_SUBTITLE: "The written plan of action in an emergency situation will allow workers to perform their actions quickly and efficiently. It maximizes the system's capabilities in resolving crisis situations and can save people's lives and expensive equipment!",
            EMERGENCY_PLAN_EMPTY_ADD_BUTTON: 'Add emergency plans',
            EMERGENCY_PLAN_LOADING_TITLE: 'Loading emergency plans',
            EMERGENCY_PLAN_NEW_RECORD: 'New emergency plan',

            EMERGENCY_PLAN_NAME_LABEL: 'Emergency plan name',
            EMERGENCY_PLAN_STEP_NAME_LABEL: 'Description of action',
            EMERGENCY_PLAN_STEP_ADD_DETAILS_BUTTON: 'Add an additional information',
            EMERGENCY_PLAN_STEP_DETAILS_TYPE_LABEL: 'Additional information type',
            EMERGENCY_PLAN_ACTION_NOTE_LABEL: 'Text',
            EMERGENCY_PLAN_ACTION_PHONE_LABEL: 'Phone',
            EMERGENCY_PLAN_ACTION_LOCAL_LINK_TYPE_LABEL: 'Page',
            EMERGENCY_PLAN_ACTION_LOCAL_LINK_LABEL: 'Description',
            EMERGENCY_PLAN_ACTION_GLOBAL_LINK_LABEL: 'URI',
            EMERGENCY_PLAN_STEP_ADD_STEP_BUTTON: 'Add actions',

            EMERGENCY_PLAN_DELETE_CONFIRMATION_TITLE: 'Delete emergency plan',

            EMERGENCY_PLAN_DETAILS: 'Emergency plan',
            EMERGENCY_PLAN_DETAILS_NEW: 'New emergency plan',
            EMERGENCY_PLAN_DETAILS_EDIT: 'Edit emergency plan',
            EMERGENCY_PLAN_STEP_NAME_REQUIRED_ERROR: 'Enter the description of action',
            EP_ACTION_PAGE_MAP: 'Map',
            EP_ACTION_PAGE_OBJECT: 'Find objects on the map',
            EP_ACTION_PAGE_LAST_EVENTS: 'Last events',
            EP_ACTION_PAGE_PEOPLE: 'Find people on the map',  
            EMERGENCY_DATAILS_COMPLETE_BUTTON: 'Complete actions',
            EP_ACTION_PAGE_SEND_SIGNALS: 'Send signal',    
            SEND_SIGNAL_OK: 'Signal sent'
        });
        pipTranslateProvider.translations('ru', {
            EMERGENCY_PLAN: 'План ЧС',
            EMERGENCY_PLANS: 'Планы по ЧС',
            EMERGENCY_PLAN_SAVE: 'Сохранить',
            EMERGENCY_PLAN_CANCEL: 'Отменить',
            EMERGENCY_PLAN_EDIT: 'Изменить',
            EMERGENCY_PLAN_DELETE: 'Удалить',
            EMERGENCY_PLAN_TITLE: 'План действий при чрезвычайной ситуации',
            EMERGENCY_PLAN_EMPTY_TITLE: 'Планы ЧС отсутствуют.',
            EMERGENCY_PLAN_EMPTY_SUBTITLE: 'Написанный план действий при чрезвычайной ситуации позволит работникам быстро и качественно выполнить положеные действия. Он максимизирует возможности системы при разрешении кризисных ситуаций и может спасти жизни людей и дорогостоящее оборудование!',
            EMERGENCY_PLAN_EMPTY_ADD_BUTTON: 'Добавить план',
            EMERGENCY_PLAN_LOADING_TITLE: 'Загрузка планов ЧС',
            EMERGENCY_PLAN_NEW_RECORD: 'Новый план ЧС',


            EMERGENCY_PLAN_NAME_LABEL: 'Название чрезвычайной ситуации',
            EMERGENCY_PLAN_STEP_NAME_LABEL: 'Описание действия',
            EMERGENCY_PLAN_STEP_ADD_DETAILS_BUTTON: 'Добавить доп. информацию',
            EMERGENCY_PLAN_STEP_DETAILS_TYPE_LABEL: 'Тип доп. информации',
            EMERGENCY_PLAN_ACTION_NOTE_LABEL: 'Текст',
            EMERGENCY_PLAN_ACTION_PHONE_LABEL: 'Телефон',
            EMERGENCY_PLAN_ACTION_LOCAL_LINK_TYPE_LABEL: 'Страница',
            EMERGENCY_PLAN_ACTION_LOCAL_LINK_LABEL: 'Описание',
            EMERGENCY_PLAN_ACTION_GLOBAL_LINK_LABEL: 'URI',
            EMERGENCY_PLAN_STEP_ADD_STEP_BUTTON: 'Добавить действие',

            EMERGENCY_PLAN_DELETE_CONFIRMATION_TITLE: 'Удалить план ЧС',

            EMERGENCY_PLAN_DETAILS: 'План ЧС',
            EMERGENCY_PLAN_DETAILS_NEW: 'Новый план ЧС',
            EMERGENCY_PLAN_DETAILS_EDIT: 'Редактирование плана ЧС',
            EMERGENCY_PLAN_STEP_NAME_REQUIRED_ERROR: 'Введите описание действия',
            EP_ACTION_PAGE_MAP: 'Карта',
            EP_ACTION_PAGE_OBJECT: 'Найти объекты на карте',
            EP_ACTION_PAGE_LAST_EVENTS: 'Последние события',
            EP_ACTION_PAGE_PEOPLE: 'Найти людей на карте',   
            EMERGENCY_DATAILS_COMPLETE_BUTTON: 'Завершить действия',
            EP_ACTION_PAGE_SEND_SIGNALS: 'Послать сигнал',
            SEND_SIGNAL_OK: 'Сигнал отправлен'   
        });
    }

    angular
        .module('iqsConfigEmergencyPlans')
        .config(declareEmergencyPlansTranslateResources);
}
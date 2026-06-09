import type { Locale } from "@/lib/i18n";

export type PrivateBetaStatus = "Pending" | "Approved" | "Rejected";

export type PrivateBetaExperienceLevel =
  | "Exploring"
  | "Intermediate"
  | "Advanced"
  | "Professional";

type PrivateBetaLocaleCopy = {
  landing: {
    badge: string;
    title: string;
    description: string;
    intro: string;
    accessTitle: string;
    accessDescription: string;
    processTitle: string;
    processDescription: string;
    successTitle: string;
    successMessage: string;
    pendingLabel: string;
    form: {
      name: string;
      email: string;
      experience: string;
      experienceHelp: string;
      interest: string;
      interestPlaceholder: string;
      submit: string;
      submitting: string;
      reset: string;
    };
    process: {
      limited: string;
      gradual: string;
      reviewed: string;
      next: string;
    };
  };
  admin: {
    badge: string;
    title: string;
    description: string;
    empty: string;
    metrics: {
      total: string;
      pending: string;
      approved: string;
      rejected: string;
      visits: string;
      submissions: string;
    };
    table: {
      name: string;
      email: string;
      date: string;
      experience: string;
      status: string;
      actions: string;
    };
    actions: {
      approve: string;
      reject: string;
      approving: string;
      rejecting: string;
    };
  };
  statusLabels: Record<PrivateBetaStatus, string>;
  experienceOptions: Array<{
    value: PrivateBetaExperienceLevel;
    label: string;
  }>;
};

const copy: Record<Locale, PrivateBetaLocaleCopy> = {
  es: {
    landing: {
      badge: "Beta Privada",
      title: "Solicita acceso al observatorio",
      description:
        "El acceso es limitado y se incorpora por etapas para asegurar feedback de calidad con usuarios reales.",
      intro:
        "Cuéntanos quién eres y qué quieres entender mejor del mercado. Revisamos cada solicitud manualmente.",
      accessTitle: "Formulario de solicitud",
      accessDescription:
        "Completa los datos para entrar a la lista de espera y ser evaluado para una ola de acceso.",
      processTitle: "Qué ocurre después del registro",
      processDescription:
        "Tu solicitud entra primero en estado Pending y se revisa de forma manual.",
      successTitle: "Tu solicitud fue recibida.",
      successMessage:
        "Estamos incorporando usuarios gradualmente para asegurar feedback de calidad. Recibirás una notificación cuando tu acceso sea aprobado.",
      pendingLabel: "Estado: Pending",
      form: {
        name: "Nombre",
        email: "Email",
        experience: "Nivel de experiencia",
        experienceHelp:
          "Selecciona la opción que mejor describa tu relación con el mercado.",
        interest: "¿Qué te gustaría entender mejor del mercado?",
        interestPlaceholder:
          "Por ejemplo: cambios de régimen, setups recurrentes o lectura de ranking.",
        submit: "Solicitar acceso",
        submitting: "Enviando solicitud...",
        reset: "Enviar otra solicitud",
      },
      process: {
        limited: "Acceso limitado para evaluar la calidad de la experiencia.",
        gradual: "Incorporación gradual para mantener feedback directo con usuarios.",
        reviewed:
          "Las solicitudes se revisan manualmente antes de aprobar un cupo.",
        next: "Después del registro, el equipo decide si el perfil entra en la siguiente ola.",
      },
    },
    admin: {
      badge: "Panel administrativo",
      title: "Solicitudes de Private Beta",
      description:
        "Visualiza la lista de espera y aprueba o rechaza solicitudes manualmente.",
      empty: "Todavía no hay solicitudes registradas.",
      metrics: {
        total: "Total",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        visits: "Landing visits",
        submissions: "Submissions",
      },
      table: {
        name: "Nombre",
        email: "Email",
        date: "Fecha",
        experience: "Experiencia",
        status: "Estado",
        actions: "Acciones",
      },
      actions: {
        approve: "Approve",
        reject: "Reject",
        approving: "Aprobando...",
        rejecting: "Rechazando...",
      },
    },
    statusLabels: {
      Pending: "Pending",
      Approved: "Approved",
      Rejected: "Rejected",
    },
    experienceOptions: [
      { value: "Exploring", label: "Explorando" },
      { value: "Intermediate", label: "Intermedio" },
      { value: "Advanced", label: "Avanzado" },
      { value: "Professional", label: "Profesional" },
    ],
  },
  en: {
    landing: {
      badge: "Private Beta",
      title: "Request access to the observatory",
      description:
        "Access is limited and rolled out in waves so we can collect quality feedback from real users.",
      intro:
        "Tell us who you are and what you want to understand better about the market. Every request is reviewed manually.",
      accessTitle: "Request form",
      accessDescription:
        "Fill in the details to join the waitlist and be considered for an access wave.",
      processTitle: "What happens after sign-up",
      processDescription:
        "Your request starts in Pending and is reviewed manually.",
      successTitle: "Your request was received.",
      successMessage:
        "We are bringing users in gradually to ensure high-quality feedback. You will receive a notification when your access is approved.",
      pendingLabel: "Status: Pending",
      form: {
        name: "Name",
        email: "Email",
        experience: "Experience level",
        experienceHelp:
          "Choose the option that best describes your relationship with the market.",
        interest: "What would you like to understand better about the market?",
        interestPlaceholder:
          "For example: regime changes, recurring setups, or ranking interpretation.",
        submit: "Request access",
        submitting: "Submitting request...",
        reset: "Submit another request",
      },
      process: {
        limited: "Limited access keeps the product evaluation focused.",
        gradual: "Users are added gradually so feedback stays direct.",
        reviewed: "Requests are reviewed manually before a seat is approved.",
        next: "After registration, the team decides whether the profile joins the next wave.",
      },
    },
    admin: {
      badge: "Admin panel",
      title: "Private Beta requests",
      description:
        "Review the waitlist and approve or reject requests manually.",
      empty: "No requests have been submitted yet.",
      metrics: {
        total: "Total",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        visits: "Landing visits",
        submissions: "Submissions",
      },
      table: {
        name: "Name",
        email: "Email",
        date: "Date",
        experience: "Experience",
        status: "Status",
        actions: "Actions",
      },
      actions: {
        approve: "Approve",
        reject: "Reject",
        approving: "Approving...",
        rejecting: "Rejecting...",
      },
    },
    statusLabels: {
      Pending: "Pending",
      Approved: "Approved",
      Rejected: "Rejected",
    },
    experienceOptions: [
      { value: "Exploring", label: "Exploring" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
      { value: "Professional", label: "Professional" },
    ],
  },
};

export function getPrivateBetaCopy(locale: Locale) {
  return copy[locale];
}

export function getPrivateBetaStatusLabel(
  status: PrivateBetaStatus,
  locale: Locale,
) {
  return copy[locale].statusLabels[status];
}

export function getPrivateBetaExperienceOptions(locale: Locale) {
  return copy[locale].experienceOptions;
}

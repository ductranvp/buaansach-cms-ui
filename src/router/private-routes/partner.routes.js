import Roles from "@/config/security/roles";

const PartnerRoutes = [
  {
    path: "dashboard",
    name: "partnerDashboardPage",
    component: () => import("@/views/private/partner/PartnerDashboard"),
    meta: {
      title: "private.partnerDashboardPage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default PartnerRoutes;

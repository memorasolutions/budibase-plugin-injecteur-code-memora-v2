/**
 * Définitions TypeScript pour l'API Budibase
 * Compatible avec le plugin Injecteur de code personnalisé
 *
 * @author MEMORA Solutions - Stéphane Lapointe
 * @email stephane@memora.ca
 * @version 1.0.0
 */

declare namespace Budibase {
  /**
   * Interface pour les queries de recherche dans searchTable
   */
  interface SearchQuery {
    /** Recherche par chaîne de caractères */
    string?: Record<string, string>;
    /** Recherche floue */
    fuzzy?: Record<string, string>;
    /** Recherche par plage de valeurs */
    range?: Record<string, { low: any; high: any }>;
    /** Recherche par égalité exacte */
    equal?: Record<string, any>;
    /** Recherche par non-égalité */
    notEqual?: Record<string, any>;
    /** Recherche de champs vides */
    empty?: Record<string, boolean>;
    /** Recherche de champs non vides */
    notEmpty?: Record<string, boolean>;
  }

  /**
   * Paramètres pour searchTable
   */
  interface SearchTableParams {
    /** ID de la table (format: "ta_xxxxx") */
    tableId: string;
    /** Critères de recherche */
    query?: SearchQuery;
    /** Nombre maximum de résultats (défaut: 50) */
    limit?: number;
    /** Champ utilisé pour le tri */
    sort?: string;
    /** Ordre de tri */
    sortOrder?: "ascending" | "descending";
    /** Nombre de résultats à ignorer */
    paginate?: boolean;
    /** Bookmark pour pagination */
    bookmark?: string;
  }

  /**
   * Résultat de searchTable
   */
  interface SearchTableResult<T = any> {
    /** Données retournées */
    data: T[];
    /** Nombre total de résultats */
    hasNextPage?: boolean;
    /** Bookmark pour pagination suivante */
    bookmark?: string;
  }

  /**
   * Paramètres pour saveRow
   */
  interface SaveRowParams {
    /** ID de la table */
    tableId: string;
    /** ID de la ligne (pour mise à jour) */
    _id?: string;
    /** Révision de la ligne (pour mise à jour) */
    _rev?: string;
    /** Champs personnalisés de votre table */
    [key: string]: any;
  }

  /**
   * Paramètres pour fetchRow
   */
  interface FetchRowParams {
    /** ID de la table */
    tableId: string;
    /** ID de la ligne à récupérer */
    rowId: string;
  }

  /**
   * Paramètres pour deleteRow
   */
  interface DeleteRowParams {
    /** ID de la table */
    tableId: string;
    /** ID de la ligne à supprimer */
    rowId: string;
    /** ID de révision de la ligne */
    revId: string;
  }

  /**
   * Interface des APIs disponibles
   */
  interface API {
    /**
     * Recherche des lignes dans une table
     * @param params Paramètres de recherche
     * @returns Promise avec les résultats
     */
    searchTable<T = any>(params: SearchTableParams): Promise<SearchTableResult<T>>;

    /**
     * Sauvegarde une ligne (création ou mise à jour)
     * @param params Données de la ligne
     * @returns Promise avec la ligne sauvegardée
     */
    saveRow<T = any>(params: SaveRowParams): Promise<T>;

    /**
     * Récupère une ligne par son ID
     * @param params Paramètres avec tableId et rowId
     * @returns Promise avec la ligne
     */
    fetchRow<T = any>(params: FetchRowParams): Promise<T>;

    /**
     * Supprime une ligne
     * @param params Paramètres de suppression
     * @returns Promise avec confirmation
     */
    deleteRow(params: DeleteRowParams): Promise<{ success: boolean }>;
  }

  /**
   * Interface pour les notifications
   */
  interface NotificationMethods {
    /**
     * Affiche une notification de succès
     * @param message Message à afficher
     */
    success(message: string): void;

    /**
     * Affiche une notification d'erreur
     * @param message Message à afficher
     */
    error(message: string): void;

    /**
     * Affiche une notification d'avertissement
     * @param message Message à afficher
     */
    warning(message: string): void;

    /**
     * Affiche une notification d'information
     * @param message Message à afficher
     */
    info(message: string): void;
  }

  /**
   * Interface pour l'utilisateur authentifié
   */
  interface AuthUser {
    /** Email de l'utilisateur */
    email: string;
    /** ID du rôle de l'utilisateur */
    roleId: string;
    /** ID de l'utilisateur */
    _id: string;
    /** Prénom */
    firstName?: string;
    /** Nom */
    lastName?: string;
    /** Statut */
    status?: string;
    /** Métadonnées personnalisées */
    [key: string]: any;
  }

  /**
   * Interface pour les informations de l'application
   */
  interface AppInfo {
    /** ID de l'application */
    appId: string;
    /** Nom de l'application */
    name?: string;
    /** URL de l'application */
    url?: string;
    /** Version */
    version?: string;
  }

  /**
   * Interface pour les informations du composant
   */
  interface ComponentInfo {
    /** ID du composant */
    id: string;
    /** Type du composant */
    type?: string;
    /** Styles du composant */
    styles?: Record<string, any>;
    /** Props du composant */
    [key: string]: any;
  }

  /**
   * Interface pour les informations de route
   */
  interface RouteInfo {
    /** Chemin actuel */
    path: string;
    /** Paramètres de l'URL */
    params?: Record<string, string>;
    /** Query strings */
    query?: Record<string, string>;
  }

  /**
   * Interface pour les informations d'écran
   */
  interface ScreenInfo {
    /** ID de l'écran */
    screenId: string;
    /** Nom de l'écran */
    name?: string;
    /** Route de l'écran */
    route?: string;
  }

  /**
   * Interface principale de l'objet budibase
   */
  interface BudibaseContext {
    /** Informations du composant */
    component: ComponentInfo;

    /** Utilisateur authentifié */
    auth: AuthUser;

    /** Informations de l'application */
    app: AppInfo;

    /** Informations de route */
    route: RouteInfo;

    /** Informations de l'écran */
    screen: ScreenInfo;

    /** APIs disponibles */
    API: API;

    /** Méthodes de notification */
    notify: NotificationMethods;
  }
}

/**
 * Objet global budibase disponible dans les scripts personnalisés
 * Disponible uniquement si "Accès au contexte Budibase" est activé
 */
declare const budibase: Budibase.BudibaseContext;

/**
 * EXEMPLES D'UTILISATION
 */

// Exemple 1: Rechercher des utilisateurs actifs
/*
budibase.API.searchTable({
  tableId: "ta_users",
  query: {
    equal: {
      status: "active"
    }
  },
  limit: 50
}).then(result => {
  console.log("Utilisateurs trouvés:", result.data)
  budibase.notify.success(`${result.data.length} utilisateurs actifs`)
})
*/

// Exemple 2: Créer un nouveau produit
/*
budibase.API.saveRow({
  tableId: "ta_products",
  name: "Nouveau produit",
  price: 99.99,
  status: "active"
}).then(result => {
  budibase.notify.success("Produit créé avec succès")
  console.log("Produit créé:", result)
})
*/

// Exemple 3: Mettre à jour un utilisateur
/*
budibase.API.fetchRow({
  tableId: "ta_users",
  rowId: "ro_123abc"
}).then(user => {
  return budibase.API.saveRow({
    ...user,
    status: "inactive",
    updated_at: new Date().toISOString()
  })
}).then(result => {
  budibase.notify.success("Utilisateur mis à jour")
})
*/

// Exemple 4: Supprimer une ligne
/*
budibase.API.deleteRow({
  tableId: "ta_users",
  rowId: "ro_123abc",
  revId: "1-xyz"
}).then(result => {
  budibase.notify.success("Ligne supprimée avec succès")
})
*/

// Exemple 5: Afficher les informations de l'utilisateur connecté
/*
const currentUser = budibase.auth
console.log("Email:", currentUser.email)
console.log("Rôle:", currentUser.roleId)

if (currentUser.roleId === "ADMIN") {
  budibase.notify.success("Bienvenue, administrateur")
} else {
  budibase.notify.info("Bienvenue, utilisateur")
}
*/

// Exemple 6: Recherche avancée avec filtres multiples
/*
budibase.API.searchTable({
  tableId: "ta_orders",
  query: {
    equal: {
      status: "pending"
    },
    range: {
      total: {
        low: 100,
        high: 1000
      }
    }
  },
  sort: "created_at",
  sortOrder: "descending",
  limit: 100
}).then(result => {
  console.log("Commandes trouvées:", result.data)
  budibase.notify.info(`${result.data.length} commandes en attente`)
})
*/

export {};

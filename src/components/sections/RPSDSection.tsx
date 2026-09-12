import React, { useState, useEffect } from 'react';
import {
  Download, FileText, Image, BookOpen, ChevronLeft, ChevronDown,
  Lock, Upload, Plus, Trash2, Edit3, Eye, EyeOff, LogOut,
  Flame, Calendar, CheckCircle, Clock, X, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigation } from '../../contexts/NavigationContext';
import {
  RPSDWeek,
  subscribeToRPSDWeeks,
  addRPSDWeek,
  updateRPSDWeek,
  deleteRPSDWeek,
  uploadRPSDFile,
  adminLogin,
  adminLogout
} from '../../firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UploadForm {
  weekNumber: number;
  year: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  isPublished: boolean;
  coverImage: File | null;
  mondayFile: File | null;
  mondayPoster: File | null;
  weekendFile: File | null;
  weekendPoster: File | null;
}

const emptyForm = (): UploadForm => ({
  weekNumber: getCurrentWeekNumber(),
  year: new Date().getFullYear(),
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  isPublished: true,
  coverImage: null,
  mondayFile: null,
  mondayPoster: null,
  weekendFile: null,
  weekendPoster: null,
});

function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

// ─── Download helper ─────────────────────────────────────────────────────────

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── Week Card (public) ───────────────────────────────────────────────────────

interface WeekCardProps {
  week: RPSDWeek;
  featured?: boolean;
  language: string;
  t: (fr: string, en: string) => string;
}

const WeekCard: React.FC<WeekCardProps> = ({ week, featured, language, t }) => {
  const title = language === 'fr' ? week.title : week.titleEn || week.title;
  const description = language === 'fr' ? week.description : week.descriptionEn || week.description;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl ${featured ? 'ring-2 ring-salem-gold' : ''}`}>
      {/* Cover image */}
      {week.coverImageUrl && (
        <img
          src={week.coverImageUrl}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      {/* Header */}
      <div className={`px-6 py-4 ${featured ? 'bg-gradient-to-r from-salem-green to-emerald-700' : 'bg-gray-50 border-b border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-widest ${featured ? 'text-salem-gold' : 'text-gray-400'}`}>
            {t('Semaine', 'Week')} {week.weekNumber} · {week.year}
          </span>
          {featured && (
            <span className="flex items-center gap-1 bg-salem-gold/20 text-salem-gold text-xs font-bold px-2 py-0.5 rounded-full">
              <Flame size={10} />
              {t('EN COURS', 'CURRENT')}
            </span>
          )}
        </div>
        <h3 className={`font-serif font-bold mt-1 ${featured ? 'text-white text-lg' : 'text-gray-800 text-base'}`}>
          {title}
        </h3>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-sm px-6 pt-4 pb-2 line-clamp-2">{description}</p>
      )}

      {/* Download buttons */}
      <div className="px-6 py-4 grid grid-cols-2 gap-3">
        {/* Monday */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-salem-green uppercase tracking-wide">
            {t('Lundi', 'Monday')}
          </p>
          {week.mondayFileUrl ? (
            <button
              onClick={() => triggerDownload(week.mondayFileUrl!, `RPSD_S${week.weekNumber}_Lundi.pdf`)}
              className="w-full flex items-center gap-2 bg-salem-green text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <FileText size={14} />
              {t('Dévotionnel', 'Devotional')}
            </button>
          ) : (
            <span className="w-full flex items-center gap-2 bg-gray-100 text-gray-400 text-xs px-3 py-2 rounded-xl">
              <Clock size={14} />
              {t('Bientôt', 'Soon')}
            </span>
          )}
          {week.mondayPosterUrl && (
            <button
              onClick={() => triggerDownload(week.mondayPosterUrl!, `RPSD_S${week.weekNumber}_Affiche_Lundi`)}
              className="w-full flex items-center gap-2 bg-salem-green/10 text-salem-green text-xs font-semibold px-3 py-2 rounded-xl hover:bg-salem-green/20 transition-colors"
            >
              <Image size={14} />
              {t('Affiche', 'Poster')}
            </button>
          )}
        </div>

        {/* Weekend */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-salem-gold uppercase tracking-wide">
            {t('Weekend', 'Weekend')}
          </p>
          {week.weekendFileUrl ? (
            <button
              onClick={() => triggerDownload(week.weekendFileUrl!, `RPSD_S${week.weekNumber}_Weekend.pdf`)}
              className="w-full flex items-center gap-2 bg-salem-gold text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-600 transition-colors"
            >
              <FileText size={14} />
              {t('Réflexion', 'Reflection')}
            </button>
          ) : (
            <span className="w-full flex items-center gap-2 bg-gray-100 text-gray-400 text-xs px-3 py-2 rounded-xl">
              <Clock size={14} />
              {t('Bientôt', 'Soon')}
            </span>
          )}
          {week.weekendPosterUrl && (
            <button
              onClick={() => triggerDownload(week.weekendPosterUrl!, `RPSD_S${week.weekNumber}_Affiche_Weekend`)}
              className="w-full flex items-center gap-2 bg-salem-gold/10 text-salem-gold text-xs font-semibold px-3 py-2 rounded-xl hover:bg-salem-gold/20 transition-colors"
            >
              <Image size={14} />
              {t('Affiche', 'Poster')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── File Input ───────────────────────────────────────────────────────────────

interface FileInputProps {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, accept, file, onChange, hint }) => (
  <div>
    <label className="block text-gray-300 text-sm mb-1">{label}</label>
    {hint && <p className="text-gray-500 text-xs mb-2">{hint}</p>}
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${file ? 'border-salem-gold bg-salem-gold/10' : 'border-gray-600 bg-gray-800/50'}`}>
        <Upload size={16} className={file ? 'text-salem-gold' : 'text-gray-500'} />
        <span className={`text-sm truncate ${file ? 'text-salem-gold' : 'text-gray-500'}`}>
          {file ? file.name : `Choisir un fichier…`}
        </span>
        {file && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null); }}
            className="ml-auto text-gray-400 hover:text-red-400"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const RPSDSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { navigateTo } = useNavigation();

  // Public state
  const [weeks, setWeeks] = useState<RPSDWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllArchive, setShowAllArchive] = useState(false);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingWeek, setEditingWeek] = useState<RPSDWeek | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>(emptyForm());
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Subscribe to RPSD weeks
  useEffect(() => {
    const unsub = subscribeToRPSDWeeks(data => {
      setWeeks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const publishedWeeks = weeks.filter(w => w.isPublished);
  const currentWeek = publishedWeeks[0] ?? null;
  const archiveWeeks = publishedWeeks.slice(1);
  const visibleArchive = showAllArchive ? archiveWeeks : archiveWeeks.slice(0, 6);

  // ── Admin login ────────────────────────────────────────────────────────────

  const handleAdminLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    const result = await adminLogin(adminLoginForm.email, adminLoginForm.password);
    if (result.success) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminLoginForm({ email: '', password: '' });
    } else {
      setLoginError(result.error || t('Erreur de connexion', 'Login error'));
    }
    setLoginLoading(false);
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  // ── Upload / Edit ──────────────────────────────────────────────────────────

  const openNewForm = () => {
    setEditingWeek(null);
    setUploadForm(emptyForm());
    setUploadError('');
    setUploadSuccess(false);
    setShowUploadForm(true);
  };

  const openEditForm = (week: RPSDWeek) => {
    setEditingWeek(week);
    setUploadForm({
      weekNumber: week.weekNumber,
      year: week.year,
      title: week.title,
      titleEn: week.titleEn,
      description: week.description,
      descriptionEn: week.descriptionEn,
      isPublished: week.isPublished,
      coverImage: null,
      mondayFile: null,
      mondayPoster: null,
      weekendFile: null,
      weekendPoster: null,
    });
    setUploadError('');
    setUploadSuccess(false);
    setShowUploadForm(true);
  };

  const handleSubmit = async () => {
    if (!uploadForm.title.trim() || !uploadForm.titleEn.trim()) {
      setUploadError(t('Le titre est obligatoire (FR et EN)', 'Title is required (FR and EN)'));
      return;
    }
    setUploadLoading(true);
    setUploadError('');

    const data = {
      weekNumber: uploadForm.weekNumber,
      year: uploadForm.year,
      title: uploadForm.title.trim(),
      titleEn: uploadForm.titleEn.trim(),
      description: uploadForm.description.trim(),
      descriptionEn: uploadForm.descriptionEn.trim(),
      isPublished: uploadForm.isPublished,
      coverImageUrl: editingWeek?.coverImageUrl ?? null,
      mondayFileUrl: editingWeek?.mondayFileUrl ?? null,
      mondayPosterUrl: editingWeek?.mondayPosterUrl ?? null,
      weekendFileUrl: editingWeek?.weekendFileUrl ?? null,
      weekendPosterUrl: editingWeek?.weekendPosterUrl ?? null,
    };

    if (editingWeek) {
      // Update metadata
      const result = await updateRPSDWeek(editingWeek.id, data);
      if (!result.success) {
        setUploadError(result.error || t('Erreur lors de la mise à jour', 'Update error'));
        setUploadLoading(false);
        return;
      }
      // Upload new files if provided
      const weekId = editingWeek.id;
      if (uploadForm.coverImage)
        await uploadRPSDFile(weekId, 'cover_image', uploadForm.coverImage)
          .then(url => updateRPSDWeek(weekId, { coverImageUrl: url }));
      if (uploadForm.mondayFile)
        await uploadRPSDFile(weekId, 'monday_devotional.pdf', uploadForm.mondayFile)
          .then(url => updateRPSDWeek(weekId, { mondayFileUrl: url }));
      if (uploadForm.mondayPoster)
        await uploadRPSDFile(weekId, 'monday_poster', uploadForm.mondayPoster)
          .then(url => updateRPSDWeek(weekId, { mondayPosterUrl: url }));
      if (uploadForm.weekendFile)
        await uploadRPSDFile(weekId, 'weekend_reflection.pdf', uploadForm.weekendFile)
          .then(url => updateRPSDWeek(weekId, { weekendFileUrl: url }));
      if (uploadForm.weekendPoster)
        await uploadRPSDFile(weekId, 'weekend_poster', uploadForm.weekendPoster)
          .then(url => updateRPSDWeek(weekId, { weekendPosterUrl: url }));
    } else {
      const result = await addRPSDWeek(data, {
        coverImage: uploadForm.coverImage ?? undefined,
        mondayFile: uploadForm.mondayFile ?? undefined,
        mondayPoster: uploadForm.mondayPoster ?? undefined,
        weekendFile: uploadForm.weekendFile ?? undefined,
        weekendPoster: uploadForm.weekendPoster ?? undefined,
      });
      if (!result.success) {
        setUploadError(result.error || t('Erreur lors de la création', 'Creation error'));
        setUploadLoading(false);
        return;
      }
    }

    setUploadSuccess(true);
    setUploadLoading(false);
    setTimeout(() => {
      setShowUploadForm(false);
      setUploadSuccess(false);
    }, 1500);
  };

  const handleDelete = async (week: RPSDWeek) => {
    if (!window.confirm(t(`Supprimer la semaine ${week.weekNumber} ?`, `Delete week ${week.weekNumber}?`))) return;
    await deleteRPSDWeek(week);
  };

  const handleTogglePublish = async (week: RPSDWeek) => {
    await updateRPSDWeek(week.id, { isPublished: !week.isPublished });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-salem-green/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #d4a826 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2c6b1e 0%, transparent 50%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-salem-gold/20 text-salem-gold border border-salem-gold/30 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Flame size={14} />
            {t('Ministère SALEM · Officiel', 'SALEM Ministry · Official')}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            RHEMA <span className="text-salem-gold">POUR LA</span> SEMAINE
          </h1>
          <p className="text-xl text-gray-300 font-light mb-2">RPSD · Dévotionnel Hebdomadaire</p>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            {t(
              'Chaque semaine, reçois la Parole et des actions concrètes pour guider tes jours — et prépare la semaine suivante avec sagesse, discipline et puissance divine.',
              'Each week, receive the Word and concrete actions to guide your days — and prepare the following week with wisdom, discipline and divine power.'
            )}
          </p>

          {/* Two parts info */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-salem-green rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="font-semibold text-sm">{t('Lundi', 'Monday')}</span>
              </div>
              <p className="text-gray-400 text-xs">{t('Parole + actions concrètes', 'Word + concrete actions')}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-salem-gold rounded-full flex items-center justify-center text-xs font-bold text-gray-900">2</span>
                <span className="font-semibold text-sm">{t('Weekend', 'Weekend')}</span>
              </div>
              <p className="text-gray-400 text-xs">{t('Réflexion + évaluation', 'Reflection + evaluation')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back + Admin trigger ── */}
      <div className="max-w-5xl mx-auto px-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-gray-500 hover:text-salem-green transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          {t('Retour', 'Back')}
        </button>
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex items-center gap-2 bg-salem-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Edit3 size={14} />
              {t('Gérer le RPSD', 'Manage RPSD')}
            </button>
            <button onClick={handleAdminLogout} className="text-gray-400 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
          >
            <Lock size={12} />
            Admin
          </button>
        )}
      </div>

      {/* ── Current week ── */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Flame size={20} className="text-salem-gold" />
          <h2 className="font-serif text-2xl font-bold text-gray-800">
            {t('Cette Semaine', 'This Week')}
          </h2>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[0, 1].map(i => (
              <div key={i} className="h-56 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : currentWeek ? (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden ring-2 ring-salem-gold/40 shadow-2xl">
            {currentWeek.coverImageUrl && (
              <img
                src={currentWeek.coverImageUrl}
                alt={language === 'fr' ? currentWeek.title : currentWeek.titleEn || currentWeek.title}
                className="w-full h-56 object-cover opacity-80"
              />
            )}
            <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 bg-salem-gold/20 text-salem-gold text-xs font-bold px-3 py-1 rounded-full border border-salem-gold/30">
                <Flame size={10} />
                {t('Semaine', 'Week')} {currentWeek.weekNumber} · {currentWeek.year}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              {language === 'fr' ? currentWeek.title : currentWeek.titleEn || currentWeek.title}
            </h3>
            {(currentWeek.description || currentWeek.descriptionEn) && (
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {language === 'fr' ? currentWeek.description : currentWeek.descriptionEn || currentWeek.description}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Monday downloads */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 bg-salem-green rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                  <span className="font-semibold text-white text-sm">{t('Lundi — Parole & Actions', 'Monday — Word & Actions')}</span>
                </div>
                <div className="space-y-2">
                  {currentWeek.mondayFileUrl ? (
                    <button
                      onClick={() => triggerDownload(currentWeek.mondayFileUrl!, `RPSD_S${currentWeek.weekNumber}_Lundi_Devotionnel.pdf`)}
                      className="w-full flex items-center gap-2 bg-salem-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <Download size={15} />
                      {t('Télécharger le Dévotionnel', 'Download Devotional')}
                    </button>
                  ) : (
                    <p className="text-gray-500 text-xs italic">{t('Fichier bientôt disponible', 'File coming soon')}</p>
                  )}
                  {currentWeek.mondayPosterUrl && (
                    <button
                      onClick={() => triggerDownload(currentWeek.mondayPosterUrl!, `RPSD_S${currentWeek.weekNumber}_Affiche_Lundi`)}
                      className="w-full flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Image size={15} />
                      {t("Télécharger l'Affiche", 'Download Poster')}
                    </button>
                  )}
                </div>
              </div>

              {/* Weekend downloads */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 bg-salem-gold rounded-full flex items-center justify-center text-xs font-bold text-gray-900">2</span>
                  <span className="font-semibold text-white text-sm">{t('Weekend — Réflexion', 'Weekend — Reflection')}</span>
                </div>
                <div className="space-y-2">
                  {currentWeek.weekendFileUrl ? (
                    <button
                      onClick={() => triggerDownload(currentWeek.weekendFileUrl!, `RPSD_S${currentWeek.weekNumber}_Weekend_Reflexion.pdf`)}
                      className="w-full flex items-center gap-2 bg-salem-gold text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      <Download size={15} />
                      {t('Télécharger la Réflexion', 'Download Reflection')}
                    </button>
                  ) : (
                    <p className="text-gray-500 text-xs italic">{t('Fichier bientôt disponible', 'File coming soon')}</p>
                  )}
                  {currentWeek.weekendPosterUrl && (
                    <button
                      onClick={() => triggerDownload(currentWeek.weekendPosterUrl!, `RPSD_S${currentWeek.weekNumber}_Affiche_Weekend`)}
                      className="w-full flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Image size={15} />
                      {t("Télécharger l'Affiche", 'Download Poster')}
                    </button>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{t('Aucun dévotionnel disponible pour le moment.', 'No devotional available yet.')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('Revenez bientôt !', 'Come back soon!')}</p>
          </div>
        )}
      </section>

      {/* ── Archive ── */}
      {archiveWeeks.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={20} className="text-gray-400" />
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              {t('Archives', 'Archives')}
            </h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {archiveWeeks.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleArchive.map(week => (
              <WeekCard key={week.id} week={week} language={language} t={t} />
            ))}
          </div>

          {archiveWeeks.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllArchive(v => !v)}
                className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-6 py-2.5 rounded-full font-semibold hover:border-salem-green hover:text-salem-green transition-colors"
              >
                {showAllArchive
                  ? t('Voir moins', 'Show less')
                  : t(`Voir tout (${archiveWeeks.length})`, `View all (${archiveWeeks.length})`)}
                <ChevronDown size={16} className={showAllArchive ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── Admin Login Modal ── */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Lock size={18} className="text-salem-gold" />
                Admin RPSD
              </h3>
              <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={adminLoginForm.email}
                onChange={e => setAdminLoginForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
              />
              <input
                type="password"
                placeholder={t('Mot de passe', 'Password')}
                value={adminLoginForm.password}
                onChange={e => setAdminLoginForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
              />
              {loginError && (
                <p className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {loginError}
                </p>
              )}
              <button
                onClick={handleAdminLogin}
                disabled={loginLoading}
                className="w-full bg-salem-gold text-gray-900 font-bold py-3 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
              >
                {loginLoading ? t('Connexion…', 'Connecting…') : t('Se connecter', 'Login')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Panel ── */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Flame size={18} className="text-salem-gold" />
                {t('Gestion RPSD', 'RPSD Management')}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={openNewForm}
                  className="flex items-center gap-2 bg-salem-gold text-gray-900 text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-500 transition-colors"
                >
                  <Plus size={15} />
                  {t('Nouvelle semaine', 'New week')}
                </button>
                <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Weeks list */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {weeks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t('Aucune semaine créée.', 'No weeks created yet.')}</p>
              ) : (
                weeks.map(week => (
                  <div key={week.id} className="flex items-center gap-4 bg-gray-800 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-gray-500 font-mono">S{week.weekNumber}/{week.year}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${week.isPublished ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {week.isPublished ? t('Publié', 'Published') : t('Brouillon', 'Draft')}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium truncate">{week.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`flex items-center gap-1 text-xs ${week.coverImageUrl ? 'text-green-400' : 'text-gray-600'}`}>
                          <CheckCircle size={10} /> {t('Image', 'Image')}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${week.mondayFileUrl ? 'text-green-400' : 'text-gray-600'}`}>
                          <CheckCircle size={10} /> {t('Lundi PDF', 'Mon PDF')}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${week.mondayPosterUrl ? 'text-green-400' : 'text-gray-600'}`}>
                          <CheckCircle size={10} /> {t('Lundi Affiche', 'Mon Poster')}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${week.weekendFileUrl ? 'text-green-400' : 'text-gray-600'}`}>
                          <CheckCircle size={10} /> {t('WE PDF', 'WE PDF')}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${week.weekendPosterUrl ? 'text-green-400' : 'text-gray-600'}`}>
                          <CheckCircle size={10} /> {t('WE Affiche', 'WE Poster')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(week)}
                        title={week.isPublished ? t('Dépublier', 'Unpublish') : t('Publier', 'Publish')}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        {week.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => openEditForm(week)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(week)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Upload / Edit Form Modal ── */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h3 className="font-bold text-white text-lg">
                {editingWeek
                  ? t(`Modifier — Semaine ${editingWeek.weekNumber}`, `Edit — Week ${editingWeek.weekNumber}`)
                  : t('Nouvelle semaine RPSD', 'New RPSD Week')}
              </h3>
              <button onClick={() => setShowUploadForm(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Week number + year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('N° de semaine', 'Week number')}</label>
                  <input
                    type="number" min={1} max={53}
                    value={uploadForm.weekNumber}
                    onChange={e => setUploadForm(f => ({ ...f, weekNumber: +e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('Année', 'Year')}</label>
                  <input
                    type="number" min={2024}
                    value={uploadForm.year}
                    onChange={e => setUploadForm(f => ({ ...f, year: +e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
                  />
                </div>
              </div>

              {/* Titles */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('Titre (FR)', 'Title (FR)')} *</label>
                  <input
                    type="text" placeholder="Ex : Marche dans la foi"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('Titre (EN)', 'Title (EN)')} *</label>
                  <input
                    type="text" placeholder="Ex: Walk in faith"
                    value={uploadForm.titleEn}
                    onChange={e => setUploadForm(f => ({ ...f, titleEn: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('Description (FR)', 'Description (FR)')}</label>
                  <textarea
                    rows={2} placeholder={t('Brève description…', 'Brief description…')}
                    value={uploadForm.description}
                    onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">{t('Description (EN)', 'Description (EN)')}</label>
                  <textarea
                    rows={2} placeholder="Brief description…"
                    value={uploadForm.descriptionEn}
                    onChange={e => setUploadForm(f => ({ ...f, descriptionEn: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-salem-gold resize-none"
                  />
                </div>
              </div>

              {/* Cover image */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">0</span>
                  {t('Image illustrative', 'Cover Image')}
                </p>
                <FileInput
                  label={t('Image de couverture (JPG/PNG)', 'Cover image (JPG/PNG)')}
                  accept="image/*"
                  file={uploadForm.coverImage}
                  onChange={file => setUploadForm(f => ({ ...f, coverImage: file }))}
                  hint={editingWeek?.coverImageUrl ? t('Laisse vide pour garder l\'image actuelle', 'Leave empty to keep current image') : undefined}
                />
              </div>

              {/* Files — Monday */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-salem-green font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-salem-green rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                  {t('Fichiers Lundi', 'Monday Files')}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <FileInput
                    label={t('Dévotionnel (PDF)', 'Devotional (PDF)')}
                    accept=".pdf"
                    file={uploadForm.mondayFile}
                    onChange={file => setUploadForm(f => ({ ...f, mondayFile: file }))}
                    hint={editingWeek?.mondayFileUrl ? t('Laisse vide pour garder le fichier actuel', 'Leave empty to keep current file') : undefined}
                  />
                  <FileInput
                    label={t('Affiche (JPG/PNG)', 'Poster (JPG/PNG)')}
                    accept="image/*"
                    file={uploadForm.mondayPoster}
                    onChange={file => setUploadForm(f => ({ ...f, mondayPoster: file }))}
                    hint={editingWeek?.mondayPosterUrl ? t('Laisse vide pour garder l\'affiche actuelle', 'Leave empty to keep current poster') : undefined}
                  />
                </div>
              </div>

              {/* Files — Weekend */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-salem-gold font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-salem-gold rounded-full flex items-center justify-center text-xs font-bold text-gray-900">2</span>
                  {t('Fichiers Weekend', 'Weekend Files')}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <FileInput
                    label={t('Réflexion (PDF)', 'Reflection (PDF)')}
                    accept=".pdf"
                    file={uploadForm.weekendFile}
                    onChange={file => setUploadForm(f => ({ ...f, weekendFile: file }))}
                    hint={editingWeek?.weekendFileUrl ? t('Laisse vide pour garder le fichier actuel', 'Leave empty to keep current file') : undefined}
                  />
                  <FileInput
                    label={t('Affiche (JPG/PNG)', 'Poster (JPG/PNG)')}
                    accept="image/*"
                    file={uploadForm.weekendPoster}
                    onChange={file => setUploadForm(f => ({ ...f, weekendPoster: file }))}
                    hint={editingWeek?.weekendPosterUrl ? t('Laisse vide pour garder l\'affiche actuelle', 'Leave empty to keep current poster') : undefined}
                  />
                </div>
              </div>

              {/* Publish toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setUploadForm(f => ({ ...f, isPublished: !f.isPublished }))}
                  className={`w-11 h-6 rounded-full transition-colors ${uploadForm.isPublished ? 'bg-salem-green' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${uploadForm.isPublished ? 'translate-x-5.5 ml-5.5' : 'ml-0.5'}`} style={{ transform: uploadForm.isPublished ? 'translateX(20px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-gray-300 text-sm">{t('Publier immédiatement', 'Publish immediately')}</span>
              </label>

              {/* Error / success */}
              {uploadError && (
                <p className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">
                  <AlertCircle size={15} />
                  {uploadError}
                </p>
              )}
              {uploadSuccess && (
                <p className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 px-4 py-3 rounded-xl">
                  <CheckCircle size={15} />
                  {t('Enregistré avec succès !', 'Saved successfully!')}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 border border-gray-700 text-gray-400 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                >
                  {t('Annuler', 'Cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploadLoading}
                  className="flex-1 bg-salem-gold text-gray-900 py-3 rounded-xl font-bold hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploadLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                      {t('Enregistrement…', 'Saving…')}
                    </>
                  ) : (
                    t(editingWeek ? 'Mettre à jour' : 'Créer la semaine', editingWeek ? 'Update' : 'Create week')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RPSDSection;

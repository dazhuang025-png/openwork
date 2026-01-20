import { Match, Show, Switch } from "solid-js";

import { formatBytes, formatRelativeTime, isTauriRuntime } from "../app/utils";

import Button from "../components/Button";
import { HardDrive, RefreshCcw, Shield, Smartphone } from "lucide-solid";

export type SettingsViewProps = {
  mode: "host" | "client" | null;
  baseUrl: string;
  headerStatus: string;
  busy: boolean;
  developerMode: boolean;
  toggleDeveloperMode: () => void;
  stopHost: () => void;
  engineSource: "path" | "sidecar";
  setEngineSource: (value: "path" | "sidecar") => void;
  isWindows: boolean;
  defaultModelLabel: string;
  defaultModelRef: string;
  openDefaultModelPicker: () => void;
  showThinking: boolean;
  toggleShowThinking: () => void;
  modelVariantLabel: string;
  editModelVariant: () => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
  demoSequence: "cold-open" | "scheduler" | "summaries" | "groceries";
  setDemoSequence: (value: "cold-open" | "scheduler" | "summaries" | "groceries") => void;
  updateAutoCheck: boolean;
  toggleUpdateAutoCheck: () => void;
  updateStatus: {
    state: string;
    lastCheckedAt?: number | null;
    version?: string;
    date?: string;
    notes?: string;
    totalBytes?: number | null;
    downloadedBytes?: number;
    message?: string;
  } | null;
  updateEnv: { supported?: boolean; reason?: string | null } | null;
  appVersion: string | null;
  checkForUpdates: () => void;
  downloadUpdate: () => void;
  installUpdateAndRestart: () => void;
  anyActiveRuns: boolean;
  onResetStartupPreference: () => void;
  openResetModal: (mode: "onboarding" | "all") => void;
  resetModalBusy: boolean;
  pendingPermissions: unknown;
  events: unknown;
  safeStringify: (value: unknown) => string;
  repairOpencodeCache: () => void;
  cacheRepairBusy: boolean;
  cacheRepairResult: string | null;
  notionStatus: "disconnected" | "connecting" | "connected" | "error";
  notionStatusDetail: string | null;
  notionError: string | null;
  notionBusy: boolean;
  connectNotion: () => void;

};

import { useI18n } from "../lib/i18n";

export default function SettingsView(props: SettingsViewProps) {
  const { t, locale, setLocale } = useI18n();
  const updateState = () => props.updateStatus?.state ?? "idle";
  const updateNotes = () => props.updateStatus?.notes ?? null;
  const updateVersion = () => props.updateStatus?.version ?? null;
  const updateDate = () => props.updateStatus?.date ?? null;
  const updateLastCheckedAt = () => props.updateStatus?.lastCheckedAt ?? null;
  const updateDownloadedBytes = () => props.updateStatus?.downloadedBytes ?? null;
  const updateTotalBytes = () => props.updateStatus?.totalBytes ?? null;
  const updateErrorMessage = () => props.updateStatus?.message ?? null;

  const notionStatusLabel = () => {
    switch (props.notionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Reload required";
      case "error":
        return "Connection failed";
      default:
        return "Not connected";
    }
  };

  const notionStatusStyle = () => {
    if (props.notionStatus === "connected") {
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
    }
    if (props.notionStatus === "error") {
      return "bg-red-500/10 text-red-300 border-red-500/20";
    }
    if (props.notionStatus === "connecting") {
      return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    }
    return "bg-zinc-800/60 text-zinc-400 border-zinc-700/50";
  };


  return (
    <section class="space-y-6">
      {/* Language Section */}
      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
        <div class="text-sm font-medium text-white">{t("settings.language")}</div>
        <div class="text-xs text-zinc-500">{t("settings.language_desc")}</div>
        <div class="flex gap-2">
          <Button
            variant={locale() === "zh-CN" ? "secondary" : "outline"}
            onClick={() => setLocale("zh-CN")}
          >
            中文
          </Button>
          <Button
            variant={locale() === "en" ? "secondary" : "outline"}
            onClick={() => setLocale("en")}
          >
            English
          </Button>
        </div>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
        <div class="text-sm font-medium text-white">{t("settings.connection")}</div>
        <div class="text-xs text-zinc-500">{props.headerStatus}</div>
        <div class="text-xs text-zinc-600 font-mono">{props.baseUrl}</div>
        <div class="pt-2 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={props.toggleDeveloperMode}>
            <Shield size={16} />
            {props.developerMode ? t("settings.dev.disable") : t("settings.dev.enable")}
          </Button>
          <Show when={props.mode === "host"}>
            <Button variant="danger" onClick={props.stopHost} disabled={props.busy}>
              {t("settings.engine.stop")}
            </Button>
          </Show>
          <Show when={props.mode === "client"}>
            <Button variant="outline" onClick={props.stopHost} disabled={props.busy}>
              {t("settings.engine.disconnect")}
            </Button>
          </Show>
        </div>

        <Show when={isTauriRuntime() && props.mode === "host"}>
          <div class="pt-4 border-t border-zinc-800/60 space-y-3">
            <div class="text-xs text-zinc-500">{t("settings.engine.source")}</div>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant={props.engineSource === "path" ? "secondary" : "outline"}
                onClick={() => props.setEngineSource("path")}
                disabled={props.busy}
              >
                PATH
              </Button>
              <Button
                variant={props.engineSource === "sidecar" ? "secondary" : "outline"}
                onClick={() => props.setEngineSource("sidecar")}
                disabled={props.busy || props.isWindows}
                title={props.isWindows ? t("settings.engine.sidecar_windows") : ""}
              >
                Sidecar
              </Button>
            </div>
            <div class="text-[11px] text-zinc-600">
              {t("settings.engine.path")}
              <Show when={props.isWindows}>
                <span class="text-zinc-500"> {t("settings.engine.sidecar_windows")}</span>
              </Show>
            </div>
          </div>
        </Show>
      </div>


      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-white">{t("settings.model")}</div>
          <div class="text-xs text-zinc-500">{t("settings.model.desc")}</div>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200 truncate">{props.defaultModelLabel}</div>
            <div class="text-xs text-zinc-600 font-mono truncate">{props.defaultModelRef}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.openDefaultModelPicker}
            disabled={props.busy}
          >
            {t("settings.model.change")}
          </Button>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200">{t("settings.model.thinking")}</div>
            <div class="text-xs text-zinc-600">{t("settings.model.thinking_desc")}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.toggleShowThinking}
            disabled={props.busy}
          >
            {props.showThinking ? "On" : "Off"}
          </Button>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200">{t("settings.model.variant")}</div>
            <div class="text-xs text-zinc-600 font-mono truncate">{props.modelVariantLabel}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.editModelVariant}
            disabled={props.busy}
          >
            {t("settings.model.edit")}
          </Button>
        </div>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-white">{t("settings.demo.title")}</div>
          <div class="text-xs text-zinc-500">{t("settings.demo.subtitle")}</div>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200">{t("settings.demo.enable")}</div>
            <div class="text-xs text-zinc-600">{t("settings.demo.enable_desc")}</div>
          </div>
          <Button
            variant={props.demoMode ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.toggleDemoMode}
            disabled={props.busy}
          >
            {props.demoMode ? "On" : "Off"}
          </Button>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            variant={props.demoSequence === "cold-open" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("cold-open")}
            disabled={props.busy || !props.demoMode}
          >
            Cold open
          </Button>
          <Button
            variant={props.demoSequence === "scheduler" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("scheduler")}
            disabled={props.busy || !props.demoMode}
          >
            Scheduler
          </Button>
          <Button
            variant={props.demoSequence === "summaries" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("summaries")}
            disabled={props.busy || !props.demoMode}
          >
            Summaries
          </Button>
          <Button
            variant={props.demoSequence === "groceries" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("groceries")}
            disabled={props.busy || !props.demoMode}
          >
            Groceries
          </Button>
        </div>

        <div class="text-xs text-zinc-600">
          {t("settings.demo.sequence")}
        </div>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-sm font-medium text-white">{t("settings.updates")}</div>
            <div class="text-xs text-zinc-500">Keep OpenWork up to date.</div>
          </div>
          <div class="text-xs text-zinc-600 font-mono">{props.appVersion ? `v${props.appVersion}` : ""}</div>
        </div>

        <Show
          when={!isTauriRuntime()}
          fallback={
            <Show
              when={props.updateEnv && props.updateEnv.supported === false}
              fallback={
                <>
                  <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <div class="space-y-0.5">
                      <div class="text-sm text-white">Automatic checks</div>
                      <div class="text-xs text-zinc-600">Once per day (quiet)</div>
                    </div>
                    <button
                      class={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${props.updateAutoCheck
                        ? "bg-white/10 text-white border-white/20"
                        : "text-zinc-500 border-zinc-800 hover:text-white"
                        }`}
                      onClick={props.toggleUpdateAutoCheck}
                    >
                      {props.updateAutoCheck ? "On" : "Off"}
                    </button>
                  </div>

                  <div class="flex items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <div class="space-y-0.5">
                      <div class="text-sm text-white">
                        <Switch>
                          <Match when={updateState() === "checking"}>Checking...</Match>
                          <Match when={updateState() === "available"}>{t("settings.update_available")}: v{updateVersion()}</Match>
                          <Match when={updateState() === "downloading"}>Downloading...</Match>
                          <Match when={updateState() === "ready"}>Ready to install: v{updateVersion()}</Match>
                          <Match when={updateState() === "error"}>Update check failed</Match>
                          <Match when={true}>{t("settings.up_to_date")}</Match>
                        </Switch>
                      </div>
                      <Show when={updateState() === "idle" && updateLastCheckedAt()}>
                        <div class="text-xs text-zinc-600">
                          {t("onboarding.last_checked")} {formatRelativeTime(updateLastCheckedAt() as number)}
                        </div>
                      </Show>
                      <Show when={updateState() === "available" && updateDate()}>
                        <div class="text-xs text-zinc-600">Published {updateDate()}</div>
                      </Show>
                      <Show when={updateState() === "downloading"}>
                        <div class="text-xs text-zinc-600">
                          {formatBytes((updateDownloadedBytes() as number) ?? 0)}
                          <Show when={updateTotalBytes() != null}>
                            {` / ${formatBytes(updateTotalBytes() as number)}`}
                          </Show>
                        </div>
                      </Show>
                      <Show when={updateState() === "error"}>
                        <div class="text-xs text-red-300">{updateErrorMessage()}</div>
                      </Show>
                    </div>

                    <div class="flex items-center gap-2">
                      <Button
                        variant="outline"
                        class="text-xs h-8 py-0 px-3"
                        onClick={props.checkForUpdates}
                        disabled={props.busy || updateState() === "checking" || updateState() === "downloading"}
                      >
                        {t("settings.check_update")}
                      </Button>

                      <Show when={updateState() === "available"}>
                        <Button
                          variant="secondary"
                          class="text-xs h-8 py-0 px-3"
                          onClick={props.downloadUpdate}
                          disabled={props.busy || updateState() === "downloading"}
                        >
                          {t("settings.download")}
                        </Button>
                      </Show>

                      <Show when={updateState() === "ready"}>
                        <Button
                          variant="secondary"
                          class="text-xs h-8 py-0 px-3"
                          onClick={props.installUpdateAndRestart}
                          disabled={props.busy || props.anyActiveRuns}
                          title={props.anyActiveRuns ? "Stop active runs to update" : ""}
                        >
                          {t("settings.restart")}
                        </Button>
                      </Show>
                    </div>
                  </div>

                  <Show when={updateState() === "available" && updateNotes()}>
                    <div class="rounded-xl bg-black/20 border border-zinc-800 p-3 text-xs text-zinc-400 whitespace-pre-wrap max-h-40 overflow-auto">
                      {updateNotes()}
                    </div>
                  </Show>
                </>
              }
            >
              <div class="rounded-xl bg-black/20 border border-zinc-800 p-3 text-sm text-zinc-400">
                {props.updateEnv?.reason ?? "Updates are not supported in this environment."}
              </div>
            </Show>
          }
        >
          <div class="rounded-xl bg-black/20 border border-zinc-800 p-3 text-sm text-zinc-400">
            Updates are only available in the desktop app.
          </div>
        </Show>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
        <div class="text-sm font-medium text-white">{t("settings.startup")}</div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div class="flex items-center gap-3">
            <div
              class={`p-2 rounded-lg ${props.mode === "host" ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400"
                }`}
            >
              <Show when={props.mode === "host"} fallback={<Smartphone size={18} />}>
                <HardDrive size={18} />
              </Show>
            </div>
            <span class="capitalize text-sm font-medium text-white">
              {props.mode === "host"
                ? t("dashboard.mode.local")
                : t("dashboard.mode.client")}
            </span>
          </div>
          <Button variant="outline" class="text-xs h-8 py-0 px-3" onClick={props.stopHost} disabled={props.busy}>
            Switch
          </Button>
        </div>

        <Button variant="secondary" class="w-full justify-between group" onClick={props.onResetStartupPreference}>
          <span class="text-zinc-300">{t("settings.startup.reset")}</span>
          <RefreshCcw size={14} class="text-zinc-500 group-hover:rotate-180 transition-transform" />
        </Button>

        <p class="text-xs text-zinc-600">
          {t("settings.startup.reset_desc")}
        </p>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-white">{t("settings.advanced")}</div>
          <div class="text-xs text-zinc-500">{t("settings.advanced.desc")}</div>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200">{t("settings.reset_onboarding")}</div>
            <div class="text-xs text-zinc-600">{t("settings.reset_onboarding_desc")}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={() => props.openResetModal("onboarding")}
            disabled={props.busy || props.resetModalBusy || props.anyActiveRuns}
            title={props.anyActiveRuns ? "Stop active runs to reset" : ""}
          >
            Reset
          </Button>
        </div>

        <div class="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-zinc-200">{t("settings.reset_data")}</div>
            <div class="text-xs text-zinc-600">{t("settings.reset_data_desc")}</div>
          </div>
          <Button
            variant="danger"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={() => props.openResetModal("all")}
            disabled={props.busy || props.resetModalBusy || props.anyActiveRuns}
            title={props.anyActiveRuns ? "Stop active runs to reset" : ""}
          >
            Reset
          </Button>
        </div>

        <div class="text-xs text-zinc-600">
          {t("settings.reset_hint")}
        </div>
      </div>

      <Show when={props.developerMode}>
        <section>
          <h3 class="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">{t("settings.developer")}</h3>

          <div class="space-y-4">
            <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="min-w-0">
                <div class="text-sm text-zinc-200">{t("settings.dev.cache")}</div>
                <div class="text-xs text-zinc-600">
                  {t("settings.dev.cache_desc")}
                </div>
                <Show when={props.cacheRepairResult}>
                  <div class="text-xs text-zinc-400 mt-2">{props.cacheRepairResult}</div>
                </Show>
              </div>
              <Button
                variant="secondary"
                class="text-xs h-8 py-0 px-3 shrink-0"
                onClick={props.repairOpencodeCache}
                disabled={props.cacheRepairBusy || !isTauriRuntime()}
                title={isTauriRuntime() ? "" : "Cache repair requires the desktop app"}
              >
                {props.cacheRepairBusy ? t("dashboard.repairing") : t("dashboard.repair_cache")}
              </Button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
                <div class="text-xs text-zinc-500 mb-2">{t("settings.dev.permissions")}</div>
                <pre class="text-xs text-zinc-200 whitespace-pre-wrap break-words max-h-64 overflow-auto">
                  {props.safeStringify(props.pendingPermissions)}
                </pre>
              </div>
              <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
                <div class="text-xs text-zinc-500 mb-2">{t("settings.dev.events")}</div>
                <pre class="text-xs text-zinc-200 whitespace-pre-wrap break-words max-h-64 overflow-auto">
                  {props.safeStringify(props.events)}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </Show>
    </section>
  );
}

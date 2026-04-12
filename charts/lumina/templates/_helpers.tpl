{{/* Define the name of the chart */}}
{{- define "lumina.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Define labels for all resources */}}
{{- define "lumina.labels" -}}
helm.sh/chart: {{ include "lumina.chart" . }}
{{ include "lumina.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/* Selector labels */}}
{{- define "lumina.selectorLabels" -}}
app.kubernetes.io/name: {{ include "lumina.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* Chart name and version label */}}
{{- define "lumina.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

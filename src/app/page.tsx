"use client"

import { useState } from 'react'
import { Calendar, Clock, Upload, Video, Trash2, Play, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ScheduledVideo {
  id: string
  file: File
  title: string
  description: string
  scheduledDate: string
  scheduledTime: string
  status: 'pending' | 'scheduled' | 'posted' | 'failed'
  thumbnail?: string
}

export default function TikTokScheduler() {
  const [videos, setVideos] = useState<ScheduledVideo[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      // Auto-generate title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      setTitle(fileName)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const scheduleVideo = () => {
    if (!selectedFile || !title || !scheduledDate || !scheduledTime) {
      return
    }

    const newVideo: ScheduledVideo = {
      id: Date.now().toString(),
      file: selectedFile,
      title,
      description,
      scheduledDate,
      scheduledTime,
      status: 'scheduled',
      thumbnail: URL.createObjectURL(selectedFile)
    }

    setVideos([...videos, newVideo])
    
    // Reset form
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setScheduledDate('')
    setScheduledTime('')
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500'
      case 'posted': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'posted': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            TikTok Scheduler
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Faça upload dos seus vídeos e programe quando eles devem ser postados no TikTok
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload & Agendar
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendados ({videos.length})
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Upload do Vídeo
                  </CardTitle>
                  <CardDescription>
                    Arraste e solte seu vídeo ou clique para selecionar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-pink-500 bg-pink-50' 
                        : selectedFile 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{selectedFile.name}</p>
                          <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Arraste seu vídeo aqui
                          </p>
                          <p className="text-sm text-gray-500">
                            Ou clique para selecionar (MP4, MOV, AVI)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileInput}
                          className="hidden"
                          id="video-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="video-upload" className="cursor-pointer">
                            Selecionar Vídeo
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Detalhes do Agendamento
                  </CardTitle>
                  <CardDescription>
                    Configure quando e como seu vídeo será postado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Vídeo</Label>
                    <Input
                      id="title"
                      placeholder="Digite o título do seu vídeo..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Adicione hashtags e descrição..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={scheduleVideo}
                    disabled={!selectedFile || !title || !scheduledDate || !scheduledTime}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Vídeo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scheduled Videos Tab */}
          <TabsContent value="scheduled">
            <div className="space-y-4">
              {videos.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Nenhum vídeo agendado
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Faça upload do seu primeiro vídeo para começar
                    </p>
                    <Button variant="outline">
                      Fazer Upload
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        {video.thumbnail && (
                          <video 
                            className="w-full h-full object-cover"
                            poster={video.thumbnail}
                          >
                            <source src={URL.createObjectURL(video.file)} type={video.file.type} />
                          </video>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className={`${getStatusColor(video.status)} text-white`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(video.status)}
                              {video.status === 'scheduled' ? 'Agendado' : 
                               video.status === 'posted' ? 'Postado' : 
                               video.status === 'failed' ? 'Falhou' : 'Pendente'}
                            </span>
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            <Play className="w-3 h-3 mr-1" />
                            {formatFileSize(video.file.size)}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(video.scheduledDate, video.scheduledTime)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeVideo(video.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}